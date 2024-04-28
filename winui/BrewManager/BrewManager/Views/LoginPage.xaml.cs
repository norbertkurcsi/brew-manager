using Microsoft.UI.Xaml.Controls;
using BrewManager.ViewModels;

namespace BrewManager.Views;

/// <summary>
/// A page that facilitates user login. This page handles user authentication and provides an interface for login credentials input.
/// </summary>
public sealed partial class LoginPage : Page
{
    /// <summary>
    /// Gets the ViewModel associated with the login page.
    /// </summary>
    public LoginViewModel ViewModel
    {
        get;
    }

    /// <summary>
    /// Initializes a new instance of the <see cref="LoginPage"/> class.
    /// This constructor retrieves the LoginViewModel from the application's service provider
    /// and initializes the components defined in XAML.
    /// </summary>
    public LoginPage()
    {
        ViewModel = App.GetService<LoginViewModel>();  // Retrieve the ViewModel specific to login functionality.
        InitializeComponent();  // Initializes the components (controls) defined in XAML.
    }
}
