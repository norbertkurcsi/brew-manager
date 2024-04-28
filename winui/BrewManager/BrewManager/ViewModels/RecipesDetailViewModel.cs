using System.Collections.ObjectModel;
using System.ComponentModel;
using BrewManager.Contracts.Services;
using BrewManager.Contracts.ViewModels;
using BrewManager.Core.Contracts.Services;
using BrewManager.Core.Models;
using BrewManager.Core.Services;
using BrewManager.Helpers;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace BrewManager.ViewModels;

public partial class RecipesDetailViewModel : ObservableRecipient, INavigationAware
{
    [ObservableProperty]
    private Recipe? recipe;
    private Recipe? originalRecipe;
    private readonly IRecipeService recipeService;
    private readonly IIngredientService ingredientService;
    private readonly ILoginService loginService;

    public ObservableCollection<Ingredient> Ingredients = new();

    [ObservableProperty]
    private Ingredient? selectedIngredient;

    [ObservableProperty]
    private bool isLoggedIn = false;

    public RecipesDetailViewModel(IRecipeService recipeService, IIngredientService ingredientService, ILoginService loginService)
    {
        this.recipeService = recipeService;
        this.ingredientService = ingredientService;
        this.loginService = loginService;
    }


    public async void OnNavigatedTo(object parameter)
    {
        IsLoggedIn = loginService.GetLoggedInUser() != null;
        if(IsLoggedIn)
        {
            if (parameter is Recipe recipeParam)
            {
                originalRecipe = recipeParam;
                Recipe = DeepCopyHelper.DeepClone(recipeParam);
                Ingredients.Clear();
                foreach (var ingredient in await ingredientService.GetInventoryItemsAsync())
                {
                    Ingredients.Add(ingredient);
                }

                foreach (var ingredient in Recipe.Ingredients)
                {
                    var toRemove = Ingredients.FirstOrDefault(i => i.Id == ingredient.Ingredient.Id);
                    if (toRemove != null)
                        Ingredients.Remove(toRemove);
                }

                SelectedIngredient = Ingredients.FirstOrDefault();
            }
        }
    }

    [RelayCommand]
    private void AddIngredient()
    {
        if (Recipe == null || SelectedIngredient == null) return;

        Recipe.Ingredients.Add(new RecipeIngredient
        {
            Ingredient = DeepCopyHelper.DeepClone(SelectedIngredient),
            Amount = 0
        });
        Ingredients.Remove(SelectedIngredient);
        SelectedIngredient = Ingredients.FirstOrDefault();

        SaveRecipeCommand.NotifyCanExecuteChanged();
    }

    [RelayCommand]
    private void AddAmount(RecipeIngredient ingredient)
    {
        ingredient.Amount += 1;
        IngredientChanged(ingredient.Ingredient.Id);
        SaveRecipeCommand.NotifyCanExecuteChanged();
    }

    [RelayCommand]
    private void RemoveAmount(RecipeIngredient ingredient)
    {
        if(ingredient.Amount >= 1 )
        {
            ingredient.Amount -= 1;
            IngredientChanged(ingredient.Ingredient.Id);
            SaveRecipeCommand.NotifyCanExecuteChanged();
        }
    }

    [RelayCommand]
    private void RemoveIngredient(RecipeIngredient ingredient)
    {
        if (Recipe == null) return;
        Recipe.Ingredients.Remove(ingredient);
        Ingredients.Add(ingredient.Ingredient);
        SaveRecipeCommand.NotifyCanExecuteChanged();
    }

    [RelayCommand(CanExecute = nameof(isRecipeModified))]
    private async void SaveRecipe()
    {
        await recipeService.ModifyRecipeAsync(Recipe);
        originalRecipe = DeepCopyHelper.DeepClone(Recipe);
        SaveRecipeCommand.NotifyCanExecuteChanged();
    }

    private bool isRecipeModified()
    {
        if (originalRecipe == null || Recipe == null)
            return false;

        if (originalRecipe.Ingredients.Count != Recipe.Ingredients.Count)
            return true;

        Dictionary<string, float> ingredientAmounts = new Dictionary<string, float>();

        foreach (var ingredient in originalRecipe.Ingredients)
        {
            ingredientAmounts[ingredient.Ingredient.Id] = ingredient.Amount;
        }

        foreach (var ingredient in Recipe.Ingredients)
        {
            if (!ingredientAmounts.ContainsKey(ingredient.Ingredient.Id) ||
                !EqualityComparer<float>.Default.Equals(ingredientAmounts[ingredient.Ingredient.Id], ingredient.Amount))
            {
                return true;
            }
        }

        return false;
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
