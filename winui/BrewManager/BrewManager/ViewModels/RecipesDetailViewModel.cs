using System.Collections.ObjectModel;
using BrewManager.Contracts.Services;
using BrewManager.Contracts.ViewModels;
using BrewManager.Core.Contracts.Services;
using BrewManager.Core.Models;
using BrewManager.Helpers;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace BrewManager.ViewModels;

/// <summary>
/// ViewModel for recipe details, allowing modification and management of individual recipes.
/// </summary>
public partial class RecipesDetailViewModel : ObservableRecipient, INavigationAware
{
    [ObservableProperty]
    private Recipe? recipe;

    private Recipe? originalRecipe;
    private readonly IRecipeService recipeService;
    private readonly IIngredientService ingredientService;
    private readonly ILoginService loginService;

    /// <summary>
    /// Collection of ingredients used in the recipe.
    /// </summary>
    public ObservableCollection<Ingredient> Ingredients = new();

    [ObservableProperty]
    private Ingredient? selectedIngredient;

    [ObservableProperty]
    private bool isLoggedIn = false;

    /// <summary>
    /// Constructs the RecipesDetailViewModel with necessary services.
    /// </summary>
    /// <param name="recipeService">Service for recipe-related operations.</param>
    /// <param name="ingredientService">Service for ingredient-related operations.</param>
    /// <param name="loginService">Service for handling login operations.</param>
    public RecipesDetailViewModel(IRecipeService recipeService, IIngredientService ingredientService, ILoginService loginService)
    {
        this.recipeService = recipeService;
        this.ingredientService = ingredientService;
        this.loginService = loginService;
    }

    /// <summary>
    /// Invoked when navigating to the view, initializes the recipe data and ingredients list.
    /// </summary>
    /// <param name="parameter">The recipe object passed as navigation parameter.</param>
    public async void OnNavigatedTo(object parameter)
    {
        IsLoggedIn = loginService.GetLoggedInUser() != null;
        if (IsLoggedIn)
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

    /// <summary>
    /// Adds a selected ingredient to the recipe.
    /// </summary>
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

    /// <summary>
    /// Increases the amount of a specific ingredient in the recipe.
    /// </summary>
    /// <param name="ingredient">The ingredient to modify.</param>
    [RelayCommand]
    private void AddAmount(RecipeIngredient ingredient)
    {
        ingredient.Amount += 1;
        IngredientChanged(ingredient.Ingredient.Id);
        SaveRecipeCommand.NotifyCanExecuteChanged();
    }

    /// <summary>
    /// Decreases the amount of a specific ingredient in the recipe.
    /// </summary>
    /// <param name="ingredient">The ingredient to modify.</param>
    [RelayCommand]
    private void RemoveAmount(RecipeIngredient ingredient)
    {
        if (ingredient.Amount >= 1)
        {
            ingredient.Amount -= 1;
            IngredientChanged(ingredient.Ingredient.Id);
            SaveRecipeCommand.NotifyCanExecuteChanged();
        }
    }

    /// <summary>
    /// Removes an ingredient from the recipe.
    /// </summary>
    /// <param name="ingredient">The ingredient to remove.</param>
    [RelayCommand]
    private void RemoveIngredient(RecipeIngredient ingredient)
    {
        if (Recipe == null) return;
        Recipe.Ingredients.Remove(ingredient);
        Ingredients.Add(ingredient.Ingredient);
        SaveRecipeCommand.NotifyCanExecuteChanged();
    }

    /// <summary>
    /// Saves modifications to the recipe if changes have been made.
    /// </summary>
    [RelayCommand(CanExecute = nameof(isRecipeModified))]
    private async void SaveRecipe()
    {
        await recipeService.ModifyRecipeAsync(Recipe);
        originalRecipe = DeepCopyHelper.DeepClone(Recipe);
        SaveRecipeCommand.NotifyCanExecuteChanged();
    }

    /// <summary>
    /// Determines if the recipe has been modified compared to the original.
    /// </summary>
    /// <returns>True if modified, false otherwise.</returns>
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

    /// <summary>
    /// Updates the ingredient within the recipe list to refresh bindings.
    /// </summary>
    /// <param name="id">The ID of the ingredient to update.</param>
    private void IngredientChanged(string id)
    {
        if (Recipe == null) return;
        var old = Recipe.Ingredients.FirstOrDefault(ing => ing.Ingredient.Id == id);
        var index = Recipe.Ingredients.IndexOf(old);
        Recipe.Ingredients[index] = new RecipeIngredient
        {
            Ingredient = old.Ingredient,
            Amount = old.Amount
        };
    }

    /// <summary>
    /// Method called when navigating away from this ViewModel.
    /// </summary>
    public void OnNavigatedFrom()
    {
    }
}
