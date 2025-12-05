using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using UseCase.Data;

namespace UseCase.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly AppDbContext _context;
        public LoginController(IConfiguration configuration, AppDbContext context)
        {
            _configuration = configuration;
            _context = context;
        }
        [HttpPost]
        public ActionResult Login([FromBody] AdminLogin model)
        {
            if (model == null)
                return BadRequest();
            var s = "";
            var x = _context.Students.FirstOrDefault(s =>  s.UserName == model.UserName && s.Password == model.Password) ;
            var y= _context.Admins.FirstOrDefault(s => s.Username == model.UserName && s.Password == model.Password);
            if (x != null)
                s = "Student";
            if (y != null)
                s = "Admin";
            if (x == null && y == null)
                return BadRequest("invalid details");
            else
            {
                var key = Encoding.ASCII.GetBytes(_configuration["Secret"]);
                var tokenHandler = new JwtSecurityTokenHandler();
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new System.Security.Claims.ClaimsIdentity(new Claim[]
                    {
                    new Claim(ClaimTypes.Name,model.UserName),
                    new Claim(ClaimTypes.Role,s)
                    }),
                    Expires = DateTime.UtcNow.AddDays(1),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha512Signature)
                };
                var token = tokenHandler.CreateToken(tokenDescriptor);
                var z = tokenHandler.WriteToken(token);
                return Ok(z);

            }
           
        }
    }

}
