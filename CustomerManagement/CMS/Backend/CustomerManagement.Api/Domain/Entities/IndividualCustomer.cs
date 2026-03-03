namespace CustomerManagement.Api.Domain.Entities;

/// <summary>
/// Concrete Individual Customer — overrides abstract members (Polymorphism).
/// Inherits all shared behaviour from abstract Customer base class.
/// </summary>
public class IndividualCustomer : Customer
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateTime? DateOfBirth { get; set; }
    public string? NationalId { get; set; }

    // Polymorphic overrides
    public override string CustomerType => "Individual";

    public override string GetDisplayName() => $"{FirstName} {LastName}";

    public override string GetSummary() =>
        $"Individual: {GetDisplayName()} | DOB: {DateOfBirth?.ToString("yyyy-MM-dd") ?? "N/A"} | {Email}";

    public override bool Validate()//(polymorpism)
    {
        return base.Validate()
            && !string.IsNullOrWhiteSpace(FirstName)
            && !string.IsNullOrWhiteSpace(LastName);
    }


    public int Age => DateOfBirth.HasValue
        ? (int)((DateTime.Today - DateOfBirth.Value).TotalDays / 365.25)
        : 0;
}
