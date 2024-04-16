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

    private void OnViewStateChanged(object sender, ListDetailsViewState e)
    {
        if (e == ListDetailsViewState.Both)
        {
            ViewModel.EnsureItemSelected();
        }
    }
}
