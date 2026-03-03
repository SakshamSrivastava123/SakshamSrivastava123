namespace CustomerManagement.Api.Application.DTOs;

public class CreateCorporateCustomerDto
{
    public string CompanyName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public string? TaxNumber { get; set; }
    public string? RegistrationNumber { get; set; }
    public string? Industry { get; set; }
    public string? ContactPersonName { get; set; }
    public int? NumberOfEmployees { get; set; }
}

public class UpdateCorporateCustomerDto : CreateCorporateCustomerDto
{
    public bool IsActive { get; set; } = true;
}
