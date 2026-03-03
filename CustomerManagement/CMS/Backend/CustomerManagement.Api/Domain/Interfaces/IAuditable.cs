namespace CustomerManagement.Api.Domain.Interfaces;

/// <summary>
/// Interface for auditable entities — tracks creation and update timestamps.
/// </summary>
public interface IAuditable
{
    DateTime CreatedAt { get; set; }
    DateTime UpdatedAt { get; set; }
    int? CreatedBy { get; set; }
}
