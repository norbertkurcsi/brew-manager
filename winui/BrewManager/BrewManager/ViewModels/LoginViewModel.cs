using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BrewManager.Contracts.Services;
using BrewManager.Contracts.ViewModels;
using BrewManager.Core.Models;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace BrewManager.ViewModels;

public partial class LoginViewModel : ObservableRecipient, INavigationAware
{
    private readonly ILoginService loginService;

    public ObservableCollection<string> ErrorList = new();

    [ObservableProperty]
    [NotifyCanExecuteChangedFor(nameof(LoginPressedCommand))]
    private string username = string.Empty;

    [ObservableProperty]
    [NotifyCanExecuteChangedFor(nameof(LoginPressedCommand))]
    private string password = string.Empty;

    [ObservableProperty]
    private string? loggedInUser;

    public LoginViewModel(ILoginService loginService) 
    {
        this.loginService = loginService;
    }

    [RelayCommand(CanExecute = nameof(loginCanExecute))]
    private async void LoginPressed()
    {
        ErrorList.Clear();
        var user = await loginService.AuthenticateAsync(Username, Password);
        if(user == null)
        {
            ErrorList.Add("Wrong username or password");
        }
        LoggedInUser = user;
    }

    [RelayCommand]
    private void LogoutPressed()
    {
        loginService.LogoutUser();
        LoggedInUser = null;
    }

    private bool loginCanExecute() => !string.IsNullOrWhiteSpace(Username) && !string.IsNullOrWhiteSpace(Password);

    public void OnNavigatedTo(object parameter)
    {
        LoggedInUser = loginService.GetLoggedInUser();
    }

    public void OnNavigatedFrom()
    {
    }
}
