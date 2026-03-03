using CustomerManagement.Api.Application.DTOs;
using CustomerManagement.Api.Domain.Entities;

namespace CustomerManagement.Api.Application.Services;

public interface IAuthService
{
    Task<LoginResponse?> LoginAsync(LoginRequest request);
    Task<User?> RegisterAsync(RegisterRequest request);
    Task<User?> GetUserByIdAsync(int id);
}
