using System.Net.Http.Json;
using BrewManager.Contracts.Services;
using BrewManager.Core.Models;
using Windows.Storage;

namespace BrewManager.Core.Services;
public class LoginService : ILoginService
{

    public async Task<string?> AuthenticateAsync(string login, string password)
    {
        using var client = new HttpClient();
        var users = await client.GetFromJsonAsync<List<User>>($"{Secrets.BaseUrl}/users");
        var loggedInUser = users.FirstOrDefault(user => user.Login == login && user.Password == password)?.Login;

        if (loggedInUser != null)
        {
            ApplicationData.Current.LocalSettings.Values["LoggedInUser"] = loggedInUser;
        }

        return loggedInUser;
    }

    public string? GetLoggedInUser()
    {
        if (ApplicationData.Current.LocalSettings.Values.ContainsKey("LoggedInUser"))
        {
            return (string) ApplicationData.Current.LocalSettings.Values["LoggedInUser"];
        }
        return null;
    }

    public void LogoutUser()
    {
        ApplicationData.Current.LocalSettings.Values.Remove("LoggedInUser");
    }
}
