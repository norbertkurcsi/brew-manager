using System.Collections.ObjectModel;
using BrewManager.Contracts.Services;
using BrewManager.Contracts.ViewModels;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace BrewManager.ViewModels;

/// <summary>
/// ViewModel for handling login functionality.
/// </summary>
public partial class LoginViewModel : ObservableRecipient, INavigationAware
{
    private readonly ILoginService loginService;

    /// <summary>
    /// Collection to store error messages.
    /// </summary>
    public ObservableCollection<string> ErrorList = new();

    /// <summary>
    /// Gets or sets the username.
    /// </summary>
    [ObservableProperty]
    [NotifyCanExecuteChangedFor(nameof(LoginPressedCommand))]
    private string username = string.Empty;

    /// <summary>
    /// Gets or sets the password.
    /// </summary>
    [ObservableProperty]
    [NotifyCanExecuteChangedFor(nameof(LoginPressedCommand))]
    private string password = string.Empty;

    /// <summary>
    /// Gets or sets the logged-in user.
    /// </summary>
    [ObservableProperty]
    private string? loggedInUser;

    /// <summary>
    /// Initializes a new instance of the <see cref="LoginViewModel"/> class.
    /// </summary>
    /// <param name="loginService">The login service.</param>
    public LoginViewModel(ILoginService loginService)
    {
        this.loginService = loginService;
    }

    /// <summary>
    /// Command to execute the login process.
    /// </summary>
    [RelayCommand(CanExecute = nameof(loginCanExecute))]
    private async void LoginPressed()
    {
        ErrorList.Clear();
        var user = await loginService.AuthenticateAsync(Username, Password);
        if (user == null)
        {
            ErrorList.Add("Wrong username or password");
        }
        LoggedInUser = user;
    }

    /// <summary>
    /// Command to execute the logout process.
    /// </summary>
    [RelayCommand]
    private void LogoutPressed()
    {
        loginService.LogoutUser();
        LoggedInUser = null;
    }

    /// <summary>
    /// Determines whether the login command can execute.
    /// </summary>
    /// <returns><c>true</c> if login command can execute; otherwise, <c>false</c>.</returns>
    private bool loginCanExecute() => !string.IsNullOrWhiteSpace(Username) && !string.IsNullOrWhiteSpace(Password);

    /// <summary>
    /// Called when the view is navigated to.
    /// </summary>
    /// <param name="parameter">The navigation parameter.</param>
    public void OnNavigatedTo(object parameter)
    {
        LoggedInUser = loginService.GetLoggedInUser();
    }

    /// <summary>
    /// Called when the view is navigated from.
    /// </summary>
    public void OnNavigatedFrom()
    {
        // Implementation not required
    }
}
