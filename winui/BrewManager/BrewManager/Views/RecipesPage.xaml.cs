using BrewManager.ViewModels;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;

namespace BrewManager.Views;

/// <summary>
/// Interface to expose the XamlRoot from a page or a component that supports XAML interactions.
/// </summary>
public interface IXamlRoot
{
    /// <summary>
    /// Retrieves the XamlRoot associated with this object.
    /// </summary>
    /// <returns>The XamlRoot, which provides a context for XAML operations.</returns>
    XamlRoot GetXamlRoot();
}

/// <summary>
/// A page that displays a list or collection of recipes. It allows for navigation to detailed views of individual recipes.
/// </summary>
public sealed partial class RecipesPage : Page, IXamlRoot
{
    /// <summary>
    /// Gets the ViewModel associated with the recipes page.
    /// </summary>
    public RecipesViewModel ViewModel
    {
        get;
    }

    /// <summary>
    /// Initializes a new instance of the <see cref="RecipesPage"/> class.
    /// Sets up the ViewModel and registers itself as the XamlRoot provider.
    /// </summary>
    public RecipesPage()
    {
        ViewModel = App.GetService<RecipesViewModel>();
        ViewModel.XamlRoot = this;  // Set this page as the XamlRoot provider for the ViewModel.
        InitializeComponent();       // Initializes the components (controls) defined in XAML.
    }

    /// <summary>
    /// Provides the XamlRoot from this page. This method is part of the IXamlRoot interface implementation.
    /// </summary>
    /// <returns>The XamlRoot associated with this page.</returns>
    public XamlRoot GetXamlRoot()
    {
        return XamlRoot;  // Return the XamlRoot associated with this Page's UI context.
    }
}
