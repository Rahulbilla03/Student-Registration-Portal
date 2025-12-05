using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UseCase.Model;

namespace UseCase.Data.Configurations
{
    public class TopicProgressTable : IEntityTypeConfiguration<TopicProgress>
    {
        public void Configure(EntityTypeBuilder<TopicProgress> builder)
        {
            builder.HasKey(tp => tp.TopicProgressId);

            builder.HasOne(tp => tp.Student)
                .WithMany(s => s.TopicProgresses)
                .HasForeignKey(tp => tp.StudentId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(tp => tp.Topic)
                .WithMany()
                .HasForeignKey(tp => tp.TopicId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Property(tp => tp.IsCompleted)
                .IsRequired();

            builder.Property(tp => tp.CompletedAt)
                .IsRequired();
        }
    }
}
