namespace CustomerManagement.Api.Domain.Entities;

/// <summary>
/// Concrete Corporate Customer — overrides abstract members (Polymorphism).
/// Inherits all shared behaviour from abstract Customer base class.
/// </summary>
public class CorporateCustomer : Customer
{
    public string CompanyName { get; set; } = string.Empty;
    public string? TaxNumber { get; set; }
    public string? RegistrationNumber { get; set; }
    public string? Industry { get; set; }
    public string? ContactPersonName { get; set; }
    public int? NumberOfEmployees { get; set; }

    // Polymorphic overrides
    public override string CustomerType => "Corporate";

    public override string GetDisplayName() => CompanyName;

    public override string GetSummary() =>
        $"Corporate: {CompanyName} | Industry: {Industry ?? "N/A"} | Employees: {NumberOfEmployees?.ToString() ?? "N/A"} | {Email}";

    public override bool Validate()
    {
        return base.Validate() && !string.IsNullOrWhiteSpace(CompanyName);
    }

}
