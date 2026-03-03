using CustomerManagement.Api.Application.DTOs;

namespace CustomerManagement.Api.Application.Services;

public interface ICustomerService
{
    Task<PagedResult<CustomerResponseDto>> GetAllCustomersAsync(int page, int pageSize, string? type, string? search);
    Task<CustomerResponseDto?> GetCustomerByIdAsync(int id);
    Task<bool> DeleteCustomerAsync(int id);
    Task<CustomerResponseDto> CreateCorporateCustomerAsync(CreateCorporateCustomerDto dto, int userId);
    //  Task<CustomerResponseDto?> UpdateIndividualCustomerAsync(int id, UpdateIndividualCustomerDto dto);
    Task<CustomerResponseDto?> UpdateCorporateCustomerAsync(int id, UpdateCorporateCustomerDto dto);
    Task<CustomerResponseDto> CreateIndividualCustomerAsync(CreateIndividualCustomerDto dto, int userId);
    Task<CustomerResponseDto?> UpdateIndividualCustomerAsync(int id, UpdateIndividualCustomerDto dto);

}
