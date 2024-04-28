using BrewManager.Contracts.Services;
using BrewManager.ViewModels;
using CommunityToolkit.WinUI.UI.Animations;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Navigation;

namespace BrewManager.Views;

/// <summary>
/// A page that displays the details of a recipe. This page handles the display and interactions for a single recipe's detailed view.
/// </summary>
public sealed partial class RecipesDetailPage : Page
{
    /// <summary>
    /// Gets the ViewModel associated with the recipe details page.
    /// </summary>
    public RecipesDetailViewModel ViewModel
    {
        get;
    }

    /// <summary>
    /// Initializes a new instance of the <see cref="RecipesDetailPage"/> class.
    /// Retrieves the ViewModel and initializes the components defined in XAML.
    /// </summary>
    public RecipesDetailPage()
    {
        ViewModel = App.GetService<RecipesDetailViewModel>();
        InitializeComponent();
    }

    /// <summary>
    /// Handles the page navigation to the recipe detail view and sets up connected animations.
    /// </summary>
    /// <param name="e">Event data that can be used to examine the conditions of the incoming navigation request.</param>
    protected override void OnNavigatedTo(NavigationEventArgs e)
    {
        base.OnNavigatedTo(e);
        // Registers the UI element 'itemHero' for a connected animation used when navigating to this page.
        this.RegisterElementForConnectedAnimation("animationKeyContentGrid", itemHero);
    }

    /// <summary>
    /// Handles the page navigating from actions, particularly to manage animations if navigating back.
    /// </summary>
    /// <param name="e">Event data that can be used to examine the conditions of the outgoing navigation and to cancel the navigation if needed.</param>
    protected override void OnNavigatingFrom(NavigatingCancelEventArgs e)
    {
        base.OnNavigatingFrom(e);
        if (e.NavigationMode == NavigationMode.Back)
        {
            var navigationService = App.GetService<INavigationService>();

            // Sets up the connected animation back to the list if the user is navigating back.
            if (ViewModel.Recipe != null)
            {
                navigationService.SetListDataItemForNextConnectedAnimation(ViewModel.Recipe);
            }
        }
    }
}
