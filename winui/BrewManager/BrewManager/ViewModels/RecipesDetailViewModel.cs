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
        IngredientsChanged();
    }

    [RelayCommand]
    private void RemoveAmount(RecipeIngredient ingredient)
    {
        if(ingredient.Amount >= 1 )
        {
            ingredient.Amount -= 1;
            IngredientsChanged();
        }
    }

    private void IngredientsChanged()
    {
        if(Recipe == null) { return; }
        var old = Recipe.Ingredients;
        Recipe.Ingredients = new();
        foreach( var ingredient in old )
        {
            Recipe.Ingredients.Add( ingredient );
        }
    }

    public void OnNavigatedFrom()
    {
    }
}
