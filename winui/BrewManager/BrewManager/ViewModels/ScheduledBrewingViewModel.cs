using System.Collections.ObjectModel;
using System.ComponentModel;
using BrewManager.Contracts.Services;
using BrewManager.Contracts.ViewModels;
using BrewManager.Core.Contracts.Services;
using BrewManager.Core.Models;

using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace BrewManager.ViewModels;

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


    public ObservableCollection<ScheduledBrewing> SampleItems { get; private set; } = new ObservableCollection<ScheduledBrewing>();
    public ObservableCollection<Recipe> AvailableRecipes { get; private set; } = new ObservableCollection<Recipe>();


    public ScheduledBrewingViewModel(IScheduledBrewingService scheduledBrewingService, IRecipeService recipeService, ILoginService loginService)
    {
        this.scheduledBrewingService = scheduledBrewingService;
        this.recipeService = recipeService;
        this.loginService = loginService;
        PropertyChanged += propertyChanged;
    }

    private void propertyChanged(object? sender, PropertyChangedEventArgs e)
    {
        if(e.PropertyName == nameof(Selected))
        {
            if(Selected == null)
            {
                IsDetailsVisible = false;
            } else
            {
                IsDetailsVisible = true;
            }
        }
    }

    public async void OnNavigatedTo(object parameter)
    {
        IsLoggedIn = loginService.GetLoggedInUser() != null;
        if(IsLoggedIn)
        {
            await refreshScheduledBrewings();
        }
    }

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

    [RelayCommand(CanExecute = nameof(canExecuteAdd))]
    private async void AddScheduledBrewing()
    {
        if (SelectedRecipe != null)
        {
            await scheduledBrewingService.PostScheduledBrewingAsync(new ScheduledBrewingPostDto { Recipe = SelectedRecipe.Id, Date = SelectedDate });
            await refreshScheduledBrewings();
        }    
    }

    [RelayCommand]
    private async void DeleteScheduledBrewing()
    {
        await scheduledBrewingService.DeleteScheduledBrewingAsync(Selected);
        Selected = null;
        await refreshScheduledBrewings();
    }

    [RelayCommand]
    private async void CompleteScheduledBrewing()
    {
        await scheduledBrewingService.CompleteScheduledBrewing(Selected);
        Selected = null;
        await refreshScheduledBrewings();
    }

    private bool canExecuteAdd() => SelectedRecipe != null;

    public void OnNavigatedFrom()
    {
    }
}
