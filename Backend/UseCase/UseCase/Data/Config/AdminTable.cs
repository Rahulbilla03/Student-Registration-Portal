using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UseCase.Model;

namespace UseCase.Data.Config
{
        public class AdminTable : IEntityTypeConfiguration<Admin>
        {
            public void Configure(EntityTypeBuilder<Admin> builder)
            {
                builder.Property(n=>n.AdminId).UseIdentityColumn();
                builder.Property(n=>n.Username).IsRequired().HasMaxLength(50);
                builder.Property(n=>n.Password).IsRequired().HasMaxLength(50);

         builder.HasData(new Admin()
            {
                AdminId = 1,
                Username = "Rahul",
                Password = "Rahul123"
            });
               
            }
        }
}
