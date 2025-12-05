using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace UseCase.Model
{
    public class Admin
    {
        [Key]
        public int AdminId {  get; set; }
        public string Username {  get; set; }
        public string Password { get; set; }
        [JsonIgnore]
        public string Role = "Admin";
    }
}
