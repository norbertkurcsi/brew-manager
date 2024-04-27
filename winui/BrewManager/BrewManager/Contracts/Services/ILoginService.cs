using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BrewManager.Core.Models;

namespace BrewManager.Contracts.Services;
public interface ILoginService
{
    public string? GetLoggedInUser();
    public Task<string?> AuthenticateAsync(string login, string password);
    public void LogoutUser();
}
