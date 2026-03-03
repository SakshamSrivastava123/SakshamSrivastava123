-- =============================================
-- Customer Management System - Database Schema
-- SQL Server
-- =============================================

CREATE DATABASE CustomerManagementDB;
GO

USE CustomerManagementDB;
GO

-- Users table for authentication
CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(100) NOT NULL UNIQUE,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(500) NOT NULL,
    PasswordSalt NVARCHAR(500) NOT NULL,
    Role NVARCHAR(50) NOT NULL DEFAULT 'User',
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    IsActive BIT DEFAULT 1
);

-- Base Customers table
CREATE TABLE Customers (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    CustomerType NVARCHAR(20) NOT NULL CHECK (CustomerType IN ('Individual', 'Corporate')),
    Email NVARCHAR(255) NOT NULL UNIQUE,
    Phone NVARCHAR(50),
    Address NVARCHAR(500),
    City NVARCHAR(100),
    Country NVARCHAR(100),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),
    CreatedBy INT FOREIGN KEY REFERENCES Users(Id)
);

-- Individual Customers
CREATE TABLE IndividualCustomers (
    Id INT PRIMARY KEY FOREIGN KEY REFERENCES Customers(Id),
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    DateOfBirth DATE,
    NationalId NVARCHAR(50)
);

-- Corporate Customers
CREATE TABLE CorporateCustomers (
    Id INT PRIMARY KEY FOREIGN KEY REFERENCES Customers(Id),
    CompanyName NVARCHAR(255) NOT NULL,
    TaxNumber NVARCHAR(100),
    RegistrationNumber NVARCHAR(100),
    Industry NVARCHAR(100),
    ContactPersonName NVARCHAR(200),
    NumberOfEmployees INT
);

-- Audit Log
CREATE TABLE AuditLogs (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT FOREIGN KEY REFERENCES Users(Id),
    Action NVARCHAR(50) NOT NULL,
    EntityType NVARCHAR(100),
    EntityId INT,
    Details NVARCHAR(MAX),
    Timestamp DATETIME2 DEFAULT GETUTCDATE()
);

-- Seed admin user (password: Admin@123)
INSERT INTO Users (Username, Email, PasswordHash, PasswordSalt, Role)
VALUES (
    'admin',
    'admin@cms.com',
    'AQAAAAEAACcQAAAAEK5Z2xVnP9kqAcuBvRLtVWkQ8sLpHzVtBhZ2Ux3gYkM4Q==',
    'randomsalt123',
    'Admin'
);

-- Seed sample customers
DECLARE @AdminId INT = SCOPE_IDENTITY();

INSERT INTO Customers (CustomerType, Email, Phone, Address, City, Country, CreatedBy)
VALUES ('Individual', 'john.doe@email.com', '+1-555-0101', '123 Main St', 'New York', 'USA', @AdminId);

INSERT INTO IndividualCustomers (Id, FirstName, LastName, DateOfBirth, NationalId)
VALUES (SCOPE_IDENTITY(), 'John', 'Doe', '1985-06-15', 'ID123456');

INSERT INTO Customers (CustomerType, Email, Phone, Address, City, Country, CreatedBy)
VALUES ('Corporate', 'contact@techcorp.com', '+1-555-0200', '456 Business Ave', 'San Francisco', 'USA', @AdminId);

INSERT INTO CorporateCustomers (Id, CompanyName, TaxNumber, RegistrationNumber, Industry, ContactPersonName, NumberOfEmployees)
VALUES (SCOPE_IDENTITY(), 'TechCorp Inc', 'TAX-98765', 'REG-11223', 'Technology', 'Jane Smith', 500);

GO
