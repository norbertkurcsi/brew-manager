using System.ComponentModel;
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
        PropertyChanged += OnPropertyChanged;
    }

    private void OnPropertyChanged(object? sender, PropertyChangedEventArgs e)
    {
        var asd = 0;
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
        IngredientChanged(ingredient.Ingredient.Id);
    }

    [RelayCommand]
    private void RemoveAmount(RecipeIngredient ingredient)
    {
        if(ingredient.Amount >= 1 )
        {
            ingredient.Amount -= 1;
            IngredientChanged(ingredient.Ingredient.Id);
        }
    }

    private void IngredientChanged(string id)
    {
        if(Recipe == null) { return; }
        var old = Recipe.Ingredients.FirstOrDefault(ing => ing.Ingredient.Id == id);
        var index = Recipe.Ingredients.IndexOf(old);
        Recipe.Ingredients[index] = new RecipeIngredient
        {
            Ingredient = old.Ingredient,
            Amount = old.Amount
        };
    }

    public void OnNavigatedFrom()
    {
    }
}
