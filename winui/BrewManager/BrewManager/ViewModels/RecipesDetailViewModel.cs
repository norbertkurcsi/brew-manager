using BrewManager.Contracts.ViewModels;
using BrewManager.Core.Contracts.Services;
using BrewManager.Core.Models;

using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace BrewManager.ViewModels;

public partial class RecipesDetailViewModel : ObservableRecipient, INavigationAware
{
    [ObservableProperty]
    private Recipe? recipe;
    private readonly IRecipeService recipeService;

    public RecipesDetailViewModel(IRecipeService recipeService)
    {
        this.recipeService = recipeService;
    }

    public void OnNavigatedTo(object parameter)
    {
        if (parameter is Recipe recipeParam)
        {
            Recipe = recipeParam;
        }
    }

    [RelayCommand]
    private void AddAmount(RecipeIngredient ingredient)
    {
        ingredient.Amount += 1;
    }

    [RelayCommand]
    private void RemoveAmount(RecipeIngredient ingredient)
    {
        if(ingredient.Amount >= 1 )
        {
            ingredient.Amount -= 1;
        }
    }

    public void OnNavigatedFrom()
    {
    }
}
