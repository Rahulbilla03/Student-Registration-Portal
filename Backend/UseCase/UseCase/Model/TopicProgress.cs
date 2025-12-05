using System.ComponentModel.DataAnnotations;

namespace UseCase.Model
{
    public class TopicProgress
    {
        [Key]
        public int TopicProgressId { get; set; }

        public int StudentId { get; set; }
        public Student Student { get; set; }

        public int TopicId { get; set; }
        public Topic Topic { get; set; }

        public bool IsCompleted { get; set; } = true;
        public DateTime CompletedAt { get; set; } = DateTime.Now;
    }
}
