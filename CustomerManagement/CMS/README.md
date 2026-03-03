# 🏢 Customer Management System

A full-stack customer management application built with **.NET 8 Core**, **React + Vite**, and **SQL Server**, demonstrating clean OOP principles throughout.

---

## 🏗️ Architecture & OOP Principles Implemented

### Backend (.NET 8 Core)

| Principle | Implementation |
|-----------|---------------|
| **Abstract Class** | `Customer` — abstract base with abstract `GetDisplayName()`, `GetSummary()`, `CustomerType` |
| **Interface** | `ICustomer`, `IAuditable`, `ICustomerRepository<T>` |
| **Polymorphism** | `IndividualCustomer` and `CorporateCustomer` override abstract members; `MapToDto()` uses C# pattern matching |
| **Encapsulation** | Private backing fields in `Customer` for `Email` (auto-lowercased) and `Phone` (trimmed) |
| **Inheritance** | `IndividualCustomer : Customer` and `CorporateCustomer : Customer` |

### Caching Strategy
- **In-Memory Cache** (`IMemoryCache`) — 5-minute TTL on customer list and detail reads
- Cache is invalidated on every create/update/delete
- Easy swap to **Redis** (commented-out config in `Program.cs`)

### Authentication
- **JWT Bearer tokens** — 8-hour expiry
- **BCrypt** password hashing with salted rounds
- Role-based authorization (`Admin` vs `User`)
- Only Admins can delete customers or register new users

---

## 📁 Project Structure

```
CustomerManagement/
├── Backend/
│   ├── Database/
│   │   └── schema.sql                     # DB schema + seed data
│   └── CustomerManagement.Api/
│       ├── Domain/
│       │   ├── Interfaces/ICustomer.cs     # ICustomer, IAuditable, ICustomerRepository<T>
│       │   └── Entities/Entities.cs        # Abstract Customer + IndividualCustomer + CorporateCustomer
│       ├── Infrastructure/Data/
│       │   └── AppDbContext.cs             # EF Core DbContext (TPT inheritance)
│       ├── Application/
│       │   ├── DTOs/CustomerDtos.cs        # Request/Response DTOs
│       │   └── Services/
│       │       ├── CustomerService.cs      # CRUD + caching
│       │       └── AuthService.cs          # JWT + BCrypt
│       ├── Controllers/Controllers.cs       # AuthController + CustomersController
│       ├── Program.cs                      # DI, JWT, CORS, Swagger
│       └── appsettings.json
└── Frontend/
    └── src/
        ├── context/AuthContext.jsx         # Global auth state
        ├── services/api.js                 # Axios + customer API calls
        ├── components/
        │   ├── Layout.jsx                  # Navbar + page wrapper
        │   └── ProtectedRoute.jsx          # Auth guard
        ├── pages/
        │   ├── Login.jsx                   # Login form
        │   ├── CustomerList.jsx            # Table with search/filter/pagination
        │   ├── IndividualForm.jsx          # Create/Edit individual
        │   ├── CorporateForm.jsx           # Create/Edit corporate
        │   └── CustomerView.jsx            # Detail view
        └── App.jsx                         # Routes
```

---

## 🚀 Setup & Running

### Prerequisites
- .NET 8 SDK
- Node.js 18+
- SQL Server (local or Docker)

---

### Step 1 — Database

```bash
# In SQL Server Management Studio or sqlcmd:
sqlcmd -S localhost -i Backend/Database/schema.sql
```

Or run from SSMS by opening `schema.sql`.

---

### Step 2 — Backend

```bash
cd Backend/CustomerManagement.Api

# Update connection string in appsettings.json:
# "DefaultConnection": "Server=localhost;Database=CustomerManagementDB;Trusted_Connection=True;TrustServerCertificate=True;"

# Restore and run:
dotnet restore
dotnet run
```

API runs at: `https://localhost:7001`  
Swagger UI: `https://localhost:7001/swagger`

---

### Step 3 — Frontend

```bash
cd Frontend

npm install
npm run dev
```

App runs at: `http://localhost:3000`

---

## 🔑 Default Credentials

| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `Admin@123` |
| Role | `Admin` |

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Get JWT token |
| POST | `/api/auth/register` | Register user (Admin only) |
| GET | `/api/auth/me` | Get current user |

### Customers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/customers` | List all (paginated + filterable) |
| GET | `/api/customers/{id}` | Get single customer |
| POST | `/api/customers/individual` | Create individual |
| POST | `/api/customers/corporate` | Create corporate |
| PUT | `/api/customers/individual/{id}` | Update individual |
| PUT | `/api/customers/corporate/{id}` | Update corporate |
| DELETE | `/api/customers/{id}` | Soft delete (Admin only) |

**Query params for GET /api/customers:**
- `page` (default: 1)
- `pageSize` (default: 10)
- `type` = `Individual` or `Corporate`
- `search` = searches name, email, company

---

## ✨ Features

- ✅ JWT authentication with role-based access
- ✅ Abstract base class + interfaces (OOP)
- ✅ Polymorphism via method overrides + C# pattern matching
- ✅ Encapsulated Email/Phone fields
- ✅ In-memory caching with cache invalidation
- ✅ Table-Per-Type (TPT) EF Core inheritance
- ✅ Soft delete (IsActive flag)
- ✅ Search, filter by type, pagination
- ✅ React protected routes
- ✅ Axios interceptors for auto-logout on 401
- ✅ Swagger/OpenAPI docs
- ✅ CORS configured for React dev server

---

## 🔧 Optional: Enable Redis Caching

In `CustomerManagement.Api/Program.cs`, uncomment:

```csharp
builder.Services.AddStackExchangeRedisCache(options => {
    options.Configuration = builder.Configuration.GetConnectionString("Redis");
    options.InstanceName = "CustomerMgmt:";
});
```

And in `appsettings.json`:
```json
"Redis": "localhost:6379"
```
