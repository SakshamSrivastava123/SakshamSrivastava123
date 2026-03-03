namespace CustomerManagement.Api.Application.DTOs;

public class CreateIndividualCustomerDto
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? NationalId { get; set; }
}

public class UpdateIndividualCustomerDto : CreateIndividualCustomerDto
{
    public bool IsActive { get; set; } = true;
}
