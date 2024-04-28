using BrewManager.Contracts.Services;
using CommunityToolkit.Mvvm.ComponentModel;
using Microsoft.UI.Xaml.Navigation;

namespace BrewManager.ViewModels;

/// <summary>
/// ViewModel for the shell of the application.
/// </summary>
public partial class ShellViewModel : ObservableRecipient
{
    /// <summary>
    /// Gets or sets a value indicating whether the back navigation is enabled.
    /// </summary>
    [ObservableProperty]
    private bool isBackEnabled;

    /// <summary>
    /// Gets or sets the selected item.
    /// </summary>
    [ObservableProperty]
    private object? selected;

    /// <summary>
    /// Gets the navigation service.
    /// </summary>
    public INavigationService NavigationService
    {
        get;
    }

    /// <summary>
    /// Gets the navigation view service.
    /// </summary>
    public INavigationViewService NavigationViewService
    {
        get;
    }

    /// <summary>
    /// Initializes a new instance of the <see cref="ShellViewModel"/> class.
    /// </summary>
    /// <param name="navigationService">The navigation service.</param>
    /// <param name="navigationViewService">The navigation view service.</param>
    public ShellViewModel(INavigationService navigationService, INavigationViewService navigationViewService)
    {
        NavigationService = navigationService;
        NavigationService.Navigated += OnNavigated; // Subscribe to navigation events
        NavigationViewService = navigationViewService;
    }

    /// <summary>
    /// Handles the navigated event.
    /// </summary>
    /// <param name="sender">The event sender.</param>
    /// <param name="e">The event arguments.</param>
    private void OnNavigated(object sender, NavigationEventArgs e)
    {
        // Update back navigation availability
        IsBackEnabled = NavigationService.CanGoBack;

        // Get the selected item from navigation view service
        var selectedItem = NavigationViewService.GetSelectedItem(e.SourcePageType);
        if (selectedItem != null)
        {
            Selected = selectedItem;
        }
    }
}
