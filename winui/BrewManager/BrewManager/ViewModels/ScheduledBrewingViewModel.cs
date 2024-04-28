using System.Collections.ObjectModel;
using System.ComponentModel;
using BrewManager.Contracts.Services;
using BrewManager.Contracts.ViewModels;
using BrewManager.Core.Contracts.Services;
using BrewManager.Core.Models;

using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace BrewManager.ViewModels;

/// <summary>
/// ViewModel for managing scheduled brewing activities within the application.
/// </summary>
public partial class ScheduledBrewingViewModel : ObservableRecipient, INavigationAware
{

    [ObservableProperty]
    private ScheduledBrewing? selected;

    private readonly IScheduledBrewingService scheduledBrewingService;
    private readonly IRecipeService recipeService;
    private readonly ILoginService loginService;

    [ObservableProperty]
    private bool isDetailsVisible = false;

    [ObservableProperty]
    private bool isLoggedIn = false;

    [ObservableProperty]
    private Recipe? selectedRecipe;

    [ObservableProperty]
    private DateTimeOffset selectedDate;

    /// <summary>
    /// Collection of scheduled brewing sessions.
    /// </summary>
    public ObservableCollection<ScheduledBrewing> SampleItems { get; private set; } = new ObservableCollection<ScheduledBrewing>();

    /// <summary>
    /// Collection of recipes available for scheduling.
    /// </summary>
    public ObservableCollection<Recipe> AvailableRecipes { get; private set; } = new ObservableCollection<Recipe>();

    /// <summary>
    /// Initializes a new instance of the <see cref="ScheduledBrewingViewModel"/> class.
    /// </summary>
    /// <param name="scheduledBrewingService">Service for managing scheduled brewings.</param>
    /// <param name="recipeService">Service for accessing recipes.</param>
    /// <param name="loginService">Service for managing user login.</param>
    public ScheduledBrewingViewModel(IScheduledBrewingService scheduledBrewingService, IRecipeService recipeService, ILoginService loginService)
    {
        this.scheduledBrewingService = scheduledBrewingService;
        this.recipeService = recipeService;
        this.loginService = loginService;
        PropertyChanged += propertyChanged;
    }

    /// <summary>
    /// Property changed event handler to react to changes in ViewModel properties.
    /// </summary>
    private void propertyChanged(object? sender, PropertyChangedEventArgs e)
    {
        if (e.PropertyName == nameof(Selected))
        {
            IsDetailsVisible = Selected != null;
        }
    }

    /// <summary>
    /// Called when navigating to this ViewModel, initializes the schedule data.
    /// </summary>
    /// <param name="parameter">Navigation parameter.</param>
    public async void OnNavigatedTo(object parameter)
    {
        IsLoggedIn = loginService.GetLoggedInUser() != null;
        if (IsLoggedIn)
        {
            await refreshScheduledBrewings();
        }
    }

    /// <summary>
    /// Refreshes the list of scheduled brewings and available recipes.
    /// </summary>
    private async Task refreshScheduledBrewings()
    {
        SampleItems.Clear();

        var data = await scheduledBrewingService.GetScheduledBrewingsAsync();
        foreach (var item in data)
        {
            SampleItems.Add(item);
        }

        var recipes = await recipeService.GetRecipesReadyForBrewingAsync();
        foreach (var recipe in recipes)
        {
            AvailableRecipes.Add(recipe);
        }
        SelectedRecipe = AvailableRecipes.FirstOrDefault();
        AddScheduledBrewingCommand.NotifyCanExecuteChanged();
        SelectedDate = DateTime.Now;
    }

    /// <summary>
    /// Command to add a new scheduled brewing session.
    /// </summary>
    [RelayCommand(CanExecute = nameof(canExecuteAdd))]
    private async void AddScheduledBrewing()
    {
        if (SelectedRecipe != null)
        {
            await scheduledBrewingService.PostScheduledBrewingAsync(new ScheduledBrewingPostDto { Recipe = SelectedRecipe.Id, Date = SelectedDate });
            await refreshScheduledBrewings();
        }
    }

    /// <summary>
    /// Command to delete a scheduled brewing session.
    /// </summary>
    [RelayCommand]
    private async void DeleteScheduledBrewing()
    {
        await scheduledBrewingService.DeleteScheduledBrewingAsync(Selected);
        Selected = null;
        await refreshScheduledBrewings();
    }

    /// <summary>
    /// Command to mark a scheduled brewing as completed.
    /// </summary>
    [RelayCommand]
    private async void CompleteScheduledBrewing()
    {
        await scheduledBrewingService.CompleteScheduledBrewing(Selected);
        Selected = null;
        await refreshScheduledBrewings();
    }

    /// <summary>
    /// Determines if the add command can be executed.
    /// </summary>
    /// <returns>True if there is a selected recipe, otherwise false.</returns>
    private bool canExecuteAdd() => SelectedRecipe != null;

    /// <summary>
    /// Method called when navigating away from this ViewModel.
    /// </summary>
    public void OnNavigatedFrom()
    {
    }
}
