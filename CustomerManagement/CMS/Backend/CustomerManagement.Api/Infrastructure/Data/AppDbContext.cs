using CustomerManagement.Api.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CustomerManagement.Api.Infrastructure.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public DbSet<User> Users => Set<User>();
        public DbSet<Customer> Customers => Set<Customer>();
        public DbSet<IndividualCustomer> IndividualCustomers => Set<IndividualCustomer>();
        public DbSet<CorporateCustomer> CorporateCustomers => Set<CorporateCustomer>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            //Table per type 
            modelBuilder.Entity<Customer>().UseTptMappingStrategy();
            modelBuilder.Entity<Customer>().ToTable("Customers");
            modelBuilder.Entity<IndividualCustomer>().ToTable("IndividualCustomers");
            modelBuilder.Entity<CorporateCustomer>().ToTable("CorporateCustomers");

            modelBuilder.Entity<Customer>().Ignore( c => c.CustomerType);

            modelBuilder.Entity<Customer>().Property(c => c.Email).IsRequired();

            base.OnModelCreating(modelBuilder);
        }
    }
}
