using CustomerManagement.Api.Domain.Interfaces;

namespace CustomerManagement.Api.Domain.Entities;

/// <summary>
/// Abstract base class — enforces OOP via abstraction and encapsulation.
/// Concrete types (Individual / Corporate) must override all abstract members.
/// </summary>
public abstract class Customer : ICustomer, IAuditable
{
    // Encapsulated backing fields
    private string _email = string.Empty;
    private string _phone = string.Empty;

    public int Id { get; set; }

    public string Email
    {
        get => _email;
        set => _email = value?.ToLowerInvariant().Trim() ?? string.Empty;
    }

    public string Phone
    {
        get => _phone;
        set => _phone = value?.Trim() ?? string.Empty;
    }

    public string? Address { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public int? CreatedBy { get; set; }

    // Abstract members — subclasses MUST implement (Abstraction)
    public abstract string CustomerType { get; }
    public abstract string GetDisplayName();
    public abstract string GetSummary();

    // Virtual method — subclasses can override (polymorphism) 
    public virtual bool Validate()
    {
        return !string.IsNullOrWhiteSpace(Email);
    }

  
}
