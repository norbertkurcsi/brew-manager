using BrewManager.ViewModels;
using Microsoft.UI.Xaml.Controls;

namespace BrewManager.Views;

/// <summary>
/// Represents the inventory page within the application.
/// This page is responsible for displaying and managing the inventory data.
/// </summary>
public sealed partial class InventoryPage : Page
{
    /// <summary>
    /// Gets the ViewModel associated with the inventory page.
    /// </summary>
    public InventoryViewModel ViewModel
    {
        get;
    }

    /// <summary>
    /// Initializes a new instance of the <see cref="InventoryPage"/> class.
    /// </summary>
    public InventoryPage()
    {
        // Retrieve the ViewModel from the application service locator.
        ViewModel = App.GetService<InventoryViewModel>();
        // Initializes the UI components defined in XAML.
        InitializeComponent();
    }
}
