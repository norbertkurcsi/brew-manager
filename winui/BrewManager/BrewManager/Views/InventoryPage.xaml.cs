using BrewManager.ViewModels;

using CommunityToolkit.WinUI.UI.Controls;

using Microsoft.UI.Xaml.Controls;

namespace BrewManager.Views;

public sealed partial class InventoryPage : Page
{
    public InventoryViewModel ViewModel
    {
        get;
    }

    public InventoryPage()
    {
        ViewModel = App.GetService<InventoryViewModel>();
        InitializeComponent();
    }
}
