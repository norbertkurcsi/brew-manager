using System.Net.Http.Json;
using BrewManager.Contracts.Services;
using BrewManager.Core.Models;
using Windows.Storage;

namespace BrewManager.Core.Services
{
    /// <summary>
    /// Provides methods for user authentication and managing logged-in users.
    /// </summary>
    public class LoginService : ILoginService
    {
        /// <summary>
        /// Authenticates a user with the provided login and password.
        /// </summary>
        /// <param name="login">The user's login.</param>
        /// <param name="password">The user's password.</param>
        /// <returns>The login of the authenticated user, or null if authentication fails.</returns>
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

        /// <summary>
        /// Retrieves the login of the currently logged-in user.
        /// </summary>
        /// <returns>The login of the currently logged-in user, or null if no user is logged in.</returns>
        public string? GetLoggedInUser()
        {
            if (ApplicationData.Current.LocalSettings.Values.ContainsKey("LoggedInUser"))
            {
                return (string)ApplicationData.Current.LocalSettings.Values["LoggedInUser"];
            }
            return null;
        }

        /// <summary>
        /// Logs out the currently logged-in user by removing their login information from local settings.
        /// </summary>
        public void LogoutUser()
        {
            ApplicationData.Current.LocalSettings.Values.Remove("LoggedInUser");
        }
    }
}
