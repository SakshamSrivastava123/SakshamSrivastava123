using System.Security.Claims;
using CustomerManagement.Api.Application.DTOs;
using CustomerManagement.Api.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CustomerManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CustomersController : ControllerBase
{
    private readonly ICustomerService _svc;


    public CustomersController(ICustomerService svc )
    {
        _svc = svc;
      
    }

    /// <summary>Get all customers — paginated, filterable by type and search term.</summary>
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? type = null,
        [FromQuery] string? search = null)
    {
        var result = await _svc.GetAllCustomersAsync(page, pageSize, type, search);
        return Ok(result);
    }

    /// <summary>Get a single customer by ID.</summary>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var customer = await _svc.GetCustomerByIdAsync(id);
        if (customer == null) return NotFound();
        return Ok(customer);
    }

    /// <summary>Create a new Individual customer.</summary>
    [HttpPost("individual")]
    public async Task<IActionResult> CreateIndividual([FromBody] CreateIndividualCustomerDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        try
        {
            var result = await _svc.CreateIndividualCustomerAsync(dto, userId);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>Create a new Corporate customer.</summary>
    [HttpPost("corporate")]
    public async Task<IActionResult> CreateCorporate([FromBody] CreateCorporateCustomerDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        try
        {
            var result = await _svc.CreateCorporateCustomerAsync(dto, userId);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>Update an existing Individual customer.</summary>
    [HttpPut("individual/{id:int}")]
    public async Task<IActionResult> UpdateIndividual(int id, [FromBody] UpdateIndividualCustomerDto dto)
    {
        var result = await _svc.UpdateIndividualCustomerAsync(id, dto);
        if (result == null) return NotFound();
        return Ok(result);
    }

    /// <summary>Update an existing Corporate customer.</summary>
    [HttpPut("corporate/{id:int}")]
    public async Task<IActionResult> UpdateCorporate(int id, [FromBody] UpdateCorporateCustomerDto dto)
    {
        var result = await _svc.UpdateCorporateCustomerAsync(id, dto);
        if (result == null) return NotFound();
        return Ok(result);
    }

    /// <summary>Soft-delete a customer. Admin only.</summary>
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _svc.DeleteCustomerAsync(id);
        if (!success) return NotFound();
        return NoContent();
    }
}
