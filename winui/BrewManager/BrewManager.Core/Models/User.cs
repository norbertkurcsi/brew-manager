namespace BrewManager.Core.Models;

/// <summary>
/// Represents a user of the application.
/// </summary>
public class User
{
    /// <summary>
    /// Gets or sets the login name of the user.
    /// </summary>
    public string Login
    {
        get; set;
    }

    /// <summary>
    /// Gets or sets the password of the user.
    /// </summary>
    public string Password
    {
        get; set;
    }

    /// <summary>
    /// Gets or sets the unique identifier of the user.
    /// </summary>
    public string Id
    {
        get; set;
    }
}
