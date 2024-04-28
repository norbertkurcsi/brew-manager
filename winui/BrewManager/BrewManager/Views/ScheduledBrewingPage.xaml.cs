using BrewManager.ViewModels;
using Microsoft.UI.Xaml.Controls;

namespace BrewManager.Views;

/// <summary>
/// A page that displays and manages the schedule of brewing activities. 
/// It provides an interface for users to view, add, delete, and complete scheduled brewings.
/// </summary>
public sealed partial class ScheduledBrewingPage : Page
{
    /// <summary>
    /// Gets the ViewModel associated with the scheduled brewing page.
    /// </summary>
    public ScheduledBrewingViewModel ViewModel
    {
        get;
    }

    /// <summary>
    /// Initializes a new instance of the <see cref="ScheduledBrewingPage"/> class.
    /// This constructor retrieves the ScheduledBrewingViewModel from the application's service provider
    /// and initializes the components defined in XAML.
    /// </summary>
    public ScheduledBrewingPage()
    {
        ViewModel = App.GetService<ScheduledBrewingViewModel>();
        InitializeComponent(); // Initializes the components (controls) defined in XAML.
    }
}
