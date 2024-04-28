using System.Collections.ObjectModel;
using BrewManager.Contracts.Services;
using BrewManager.Contracts.ViewModels;
using BrewManager.Core.Contracts.Services;
using BrewManager.Core.Models;
using BrewManager.Core.Services;
using BrewManager.Views;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Microsoft.UI.Xaml.Controls;

namespace BrewManager.ViewModels;

/// <summary>
/// ViewModel for managing recipes within the application.
/// </summary>
public partial class RecipesViewModel : ObservableRecipient, INavigationAware
{
    private readonly INavigationService _navigationService;
    private readonly IRecipeService _recipeService;
    private readonly INewRecipeDialogService newRecipeDialogService;
    private readonly ILoginService loginService;
    private readonly IScheduledBrewingService scheduledBrewingService;
    [ObservableProperty]
    private string infoBarMassege = "";

    [ObservableProperty]
    private InfoBarSeverity infoBarSeverity;

    [ObservableProperty]
    private bool isInfoBarOpen = false;

    [ObservableProperty]
    private bool isLoggedIn = false;

    /// <summary>
    /// Collection of recipes to be displayed.
    /// </summary>
    public ObservableCollection<Recipe> Source { get; } = new ObservableCollection<Recipe>();

    /// <summary>
    /// Provides access to the XamlRoot required for showing dialogs.
    /// </summary>
    public IXamlRoot XamlRoot
    {
        get;
        internal set;
    }

    /// <summary>
    /// Initializes a new instance of the <see cref="RecipesViewModel"/> class.
    /// </summary>
    /// <param name="navigationService">Service for handling navigation.</param>
    /// <param name="recipeService">Service for handling recipe operations.</param>
    /// <param name="newRecipeDialogService">Service for managing new recipe dialogs.</param>
    /// <param name="loginService">Service for handling login operations.</param>
    public RecipesViewModel(
        INavigationService navigationService,
        IRecipeService recipeService,
        INewRecipeDialogService newRecipeDialogService,
        ILoginService loginService,
        IScheduledBrewingService scheduledBrewingService)
    {
        _navigationService = navigationService;
        _recipeService = recipeService;
        this.newRecipeDialogService = newRecipeDialogService;
        this.loginService = loginService;
        this.scheduledBrewingService = scheduledBrewingService;
    }

    /// <summary>
    /// Called when navigating to this ViewModel, refreshes the recipes if logged in.
    /// </summary>
    /// <param name="parameter">Navigation parameter.</param>
    public void OnNavigatedTo(object parameter)
    {
        IsLoggedIn = loginService.GetLoggedInUser() != null;
        if (IsLoggedIn)
        {
            refreshRecipes();
        }
    }

    /// <summary>
    /// Refreshes the recipes from the service.
    /// </summary>
    private async void refreshRecipes()
    {
        Source.Clear();

        var data = await _recipeService.GetRecipesAsync();
        foreach (var item in data)
        {
            Source.Add(item);
        }
    }

    /// <summary>
    /// Command to add a new recipe via a dialog.
    /// </summary>
    [RelayCommand]
    private async void AddButtonClicked()
    {
        ContentDialog dialog = new ContentDialog();

        dialog.XamlRoot = XamlRoot.GetXamlRoot();
        dialog.Title = "Add new recipe";
        dialog.PrimaryButtonText = "Save";
        dialog.CloseButtonText = "Cancel";
        dialog.DefaultButton = ContentDialogButton.Primary;
        dialog.Content = newRecipeDialogService.GetDialogContent();

        var result = await dialog.ShowAsync();
        if (result == ContentDialogResult.Primary)
        {
            await newRecipeDialogService.Save();
            refreshRecipes();
        }
        newRecipeDialogService.Clear();
    }

    private async void ShowInfoBar(object? sender, SnackbarEventArgs e)
    {
        InfoBarSeverity = e.isSuccess ? InfoBarSeverity.Success : InfoBarSeverity.Error;
        InfoBarMassege = e.Message;
        if (e.isSuccess)
        IsInfoBarOpen = true;
        await Task.Delay(3000);
        IsInfoBarOpen = false;
    }

    /// <summary>
    /// Method called when navigating away from this ViewModel.
    /// </summary>
    public void OnNavigatedFrom()
    {
    }

    /// <summary>
    /// Command to handle recipe item click, navigates to the recipe details.
    /// </summary>
    /// <param name="clickedItem">The clicked recipe item.</param>
    [RelayCommand]
    private void OnItemClick(Recipe? clickedItem)
    {
        if (clickedItem != null)
        {
            _navigationService.SetListDataItemForNextConnectedAnimation(clickedItem);
            _navigationService.NavigateTo(typeof(RecipesDetailViewModel).FullName!, clickedItem);
        }
    }

    /// <summary>
    /// Command to delete a recipe from the collection.
    /// </summary>
    /// <param name="recipe">The recipe to delete.</param>
    [RelayCommand]
    private async void DeleteRecipe(Recipe recipe)
    {
        await scheduledBrewingService.DeleteAllSchedulesThatAreBasedOnRecipe(recipe.Id);
        await _recipeService.DeleteRecipeAsync(recipe.Id);
        refreshRecipes();
    }
}
