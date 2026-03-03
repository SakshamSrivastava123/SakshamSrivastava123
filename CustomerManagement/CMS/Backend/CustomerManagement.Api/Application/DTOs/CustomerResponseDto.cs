namespace CustomerManagement.Api.Application.DTOs;

/// <summary>
/// Unified response DTO for both Individual and Corporate customers.
/// Type-specific fields are nullable for the opposite type.
/// </summary>
public class CustomerResponseDto
{
    public int Id { get; set; }
    public string CustomerType { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Individual-only fields (null for Corporate)
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? NationalId { get; set; }
    public int? Age { get; set; }

    // Corporate-only fields (null for Individual)
    public string? CompanyName { get; set; }
    public string? TaxNumber { get; set; }
    public string? RegistrationNumber { get; set; }
    public string? Industry { get; set; }
    public string? ContactPersonName { get; set; }
    public int? NumberOfEmployees { get; set; }
}
