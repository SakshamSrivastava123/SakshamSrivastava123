using CustomerManagement.Api.Application.DTOs;
using CustomerManagement.Api.Domain.Entities;
using CustomerManagement.Api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System.Drawing.Drawing2D;
using System.Drawing.Printing;

namespace CustomerManagement.Api.Application.Services;

public class CustomerService : ICustomerService 
{
    private readonly AppDbContext _db;
    private readonly IMemoryCache _cache;


    private const string CacheKeyAll = "customers_all";
    private const int CacheMinutes = 5;

    public CustomerService(AppDbContext db, IMemoryCache cache)
    {
        _db = db;
        _cache = cache;
   
    }


    private void InvalidateCache()
    {
        _cache.Remove(CacheKeyAll);
    }

    /// <summary>
    /// Polymorphic mapping — GetDisplayName() dispatches to the correct override at runtime.
    /// Pattern matching handles type-specific field mapping.
    /// </summary>
    private static CustomerResponseDto MapToDto(Customer c)
    {
        var dto = new CustomerResponseDto
        {
            Id        = c.Id,
            CustomerType = c.CustomerType,     // polymorphic property
            DisplayName  = c.GetDisplayName(), // polymorphic method
            Email    = c.Email,
            Phone    = c.Phone,
            Address  = c.Address,
            City     = c.City,
            Country  = c.Country,
            IsActive = c.IsActive,
            CreatedAt = c.CreatedAt,
            UpdatedAt = c.UpdatedAt,
        };

        switch (c)
        {
            case IndividualCustomer ind:
                dto.FirstName    = ind.FirstName;
                dto.LastName     = ind.LastName;
                dto.DateOfBirth  = ind.DateOfBirth;
                dto.NationalId   = ind.NationalId;
                dto.Age          = ind.Age;
                break;

            case CorporateCustomer corp:
                dto.CompanyName         = corp.CompanyName;
                dto.TaxNumber           = corp.TaxNumber;
                dto.RegistrationNumber  = corp.RegistrationNumber;
                dto.Industry            = corp.Industry;
                dto.ContactPersonName   = corp.ContactPersonName;
                dto.NumberOfEmployees   = corp.NumberOfEmployees;
                break;
        }

        return dto;
    }

    public async Task<PagedResult<CustomerResponseDto>> GetAllCustomersAsync(
        int page, int pageSize, string? type, string? search)
    {
        // Serve from cache only for the plain default query
        if (type == null && search == null && page == 1 && pageSize == 10)
        {
            if (_cache.TryGetValue(CacheKeyAll, out PagedResult<CustomerResponseDto>? cached) && cached != null)
                return cached;
        }

        IQueryable<Customer> query = _db.Customers.Where(c => c.IsActive);

        // Type filter — use EF TPT subtype queries (no discriminator column needed)
        if (!string.IsNullOrWhiteSpace(type))
        {
            query = type switch
            {
                "Individual" => _db.IndividualCustomers.Where(c => c.IsActive),
                "Corporate"  => _db.CorporateCustomers.Where(c => c.IsActive),
                _            => query
            };
        }

        // Search — done in-memory after load for simplicity with TPT
        var total = await query.CountAsync();
        var items = await query
            .OrderByDescending(c => c.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        // Apply search filter in-memory (post-load)
        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.ToLower();
            items = items.Where(c =>
                c.Email.Contains(s) ||
                (c.City?.ToLower().Contains(s) ?? false) ||
                (c is IndividualCustomer ind && (
                    ind.FirstName.ToLower().Contains(s) ||
                    ind.LastName.ToLower().Contains(s))) ||
                (c is CorporateCustomer corp &&
                    corp.CompanyName.ToLower().Contains(s))
            ).ToList();

            total = items.Count;
        }

        var result = new PagedResult<CustomerResponseDto>
        {
            Items      = items.Select(MapToDto),
            TotalCount = total,
            Page       = page,
            PageSize   = pageSize
        };

        if (type == null && search == null && page == 1 && pageSize == 10)
            _cache.Set(CacheKeyAll, result, TimeSpan.FromMinutes(CacheMinutes));

        return result;
    }

    public async Task<CustomerResponseDto?> GetCustomerByIdAsync(int id)
    {
        var cacheKey = $"customer_{id}";
        if (_cache.TryGetValue(cacheKey, out CustomerResponseDto? cached))
            return cached;

        var customer = await _db.Customers.FindAsync(id);
        if (customer == null) return null;

        var dto = MapToDto(customer);
        _cache.Set(cacheKey, dto, TimeSpan.FromMinutes(CacheMinutes));
        return dto;
    }

    public async Task<CustomerResponseDto> CreateIndividualCustomerAsync(
        CreateIndividualCustomerDto dto, int userId)
    {
        var customer = new IndividualCustomer
        {
            FirstName   = dto.FirstName,
            LastName    = dto.LastName,
            Email       = dto.Email,
            Phone       = dto.Phone ?? string.Empty,
            Address     = dto.Address,
            City        = dto.City,
            Country     = dto.Country,
            DateOfBirth = dto.DateOfBirth,
            NationalId  = dto.NationalId,
            CreatedBy   = userId
        };


        if (!customer.Validate())
            throw new InvalidOperationException("Invalid individual customer data.");

        _db.IndividualCustomers.Add(customer);
        await _db.SaveChangesAsync();
        InvalidateCache();
        return MapToDto(customer);
    }

    public async Task<CustomerResponseDto> CreateCorporateCustomerAsync(
        CreateCorporateCustomerDto dto, int userId)
    {
        var customer = new CorporateCustomer
        {
            CompanyName          = dto.CompanyName,
            Email                = dto.Email,
            Phone                = dto.Phone ?? string.Empty,
            Address              = dto.Address,
            City                 = dto.City,
            Country              = dto.Country,
            TaxNumber            = dto.TaxNumber,
            RegistrationNumber   = dto.RegistrationNumber,
            Industry             = dto.Industry,
            ContactPersonName    = dto.ContactPersonName,
            NumberOfEmployees    = dto.NumberOfEmployees,
            CreatedBy            = userId
        };


        if (!customer.Validate())
            throw new InvalidOperationException("Invalid corporate customer data.");

        _db.CorporateCustomers.Add(customer);
        await _db.SaveChangesAsync();
        InvalidateCache();
        return MapToDto(customer);
    }

    public async Task<CustomerResponseDto?> UpdateIndividualCustomerAsync(
        int id, UpdateIndividualCustomerDto dto)
    {
        var customer = await _db.IndividualCustomers.FindAsync(id);
        if (customer == null) return null;

        customer.FirstName   = dto.FirstName;
        customer.LastName    = dto.LastName;
        customer.Email       = dto.Email;
        customer.Phone       = dto.Phone ?? string.Empty;
        customer.Address     = dto.Address;
        customer.City        = dto.City;
        customer.Country     = dto.Country;
        customer.DateOfBirth = dto.DateOfBirth;
        customer.NationalId  = dto.NationalId;
        customer.IsActive    = dto.IsActive;
        customer.UpdatedAt   = DateTime.UtcNow;



        await _db.SaveChangesAsync();
        InvalidateCache();
        _cache.Remove($"customer_{id}");
        return MapToDto(customer);
    }

    public async Task<CustomerResponseDto?> UpdateCorporateCustomerAsync(
        int id, UpdateCorporateCustomerDto dto)
    {
        var customer = await _db.CorporateCustomers.FindAsync(id);
        if (customer == null) return null;

        customer.CompanyName         = dto.CompanyName;
        customer.Email               = dto.Email;
        customer.Phone               = dto.Phone ?? string.Empty;
        customer.Address             = dto.Address;
        customer.City                = dto.City;
        customer.Country             = dto.Country;
        customer.TaxNumber           = dto.TaxNumber;
        customer.RegistrationNumber  = dto.RegistrationNumber;
        customer.Industry            = dto.Industry;
        customer.ContactPersonName   = dto.ContactPersonName;
        customer.NumberOfEmployees   = dto.NumberOfEmployees;
        customer.IsActive            = dto.IsActive;
        customer.UpdatedAt           = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        InvalidateCache();
        _cache.Remove($"customer_{id}");
        return MapToDto(customer);
    }

    public async Task<bool> DeleteCustomerAsync(int id)
    {
        var customer = await _db.Customers.FindAsync(id);
        if (customer == null) return false;

        // Soft delete — preserve data, mark inactive
        customer.IsActive  = false;
        customer.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        InvalidateCache();
        _cache.Remove($"customer_{id}");
        return true;
    }


}
