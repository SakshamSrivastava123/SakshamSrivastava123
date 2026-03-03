namespace CustomerManagement.Api.Domain.Interfaces;

/// <summary>
/// Interface defining core customer contract — implemented by abstract Customer base.
/// </summary>
public interface ICustomer
{
    int Id { get; set; }
    string Email { get; set; }
    string Phone { get; set; }
    string CustomerType { get; }
    string GetDisplayName();
    string GetSummary();
    bool IsActive { get; set; }
}
