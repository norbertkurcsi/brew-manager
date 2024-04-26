using BrewManager.ViewModels;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;

namespace BrewManager.Views;

public interface IXamlRoot
{
    public XamlRoot GetXamlRoot();
}

public sealed partial class RecipesPage : Page, IXamlRoot
{
    public RecipesViewModel ViewModel
    {
        get;
    }

    public RecipesPage()
    {
        ViewModel = App.GetService<RecipesViewModel>();
        ViewModel.XamlRoot = this;
        InitializeComponent();
    }

    public XamlRoot GetXamlRoot()
    {
        return XamlRoot;
    }
}
