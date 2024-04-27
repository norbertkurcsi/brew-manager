using BrewManager.ViewModels;

using CommunityToolkit.WinUI.UI.Controls;

using Microsoft.UI.Xaml.Controls;

namespace BrewManager.Views;

public sealed partial class ScheduledBrewingPage : Page
{
    public ScheduledBrewingViewModel ViewModel
    {
        get;
    }

    public ScheduledBrewingPage()
    {
        ViewModel = App.GetService<ScheduledBrewingViewModel>();
        InitializeComponent();
    }
}
