using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace UseCase.Model
{
    public class Enrollment
    {
        [Key]
        public int EnrollmentId {  get; set; }
        public int StudentId {  get; set; }
        public int CourseId {  get; set; }
        public Student Student { get; set; }
        public Course Course {  get; set; }


    }
}
