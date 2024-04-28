using BrewManager.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BrewManager.Core.Contracts.Services;

/// <summary>
/// Provides an interface for managing recipe data within the application.
/// This includes retrieving, posting, deleting, and modifying recipes.
/// </summary>
public interface IRecipeService
{
    /// <summary>
    /// Retrieves all recipes asynchronously.
    /// </summary>
    /// <returns>A task that represents the asynchronous operation and contains a list of recipes.</returns>
    Task<List<Recipe>> GetRecipesAsync();

    /// <summary>
    /// Retrieves recipes that are ready for brewing asynchronously.
    /// </summary>
    /// <returns>A task that represents the asynchronous operation and contains a list of recipes ready for brewing.</returns>
    Task<List<Recipe>> GetRecipesReadyForBrewingAsync();

    /// <summary>
    /// Posts a new recipe asynchronously.
    /// </summary>
    /// <param name="recipe">The recipe data transfer object containing the details of the new recipe.</param>
    /// <returns>A task that represents the asynchronous operation.</returns>
    Task PostRecipeAsync(RecipePostDto recipe);

    /// <summary>
    /// Deletes a recipe by its identifier asynchronously.
    /// </summary>
    /// <param name="id">The identifier of the recipe to delete.</param>
    /// <returns>A task that represents the asynchronous operation.</returns>
    Task DeleteRecipeAsync(string id);

    /// <summary>
    /// Modifies an existing recipe asynchronously.
    /// </summary>
    /// <param name="recipe">The recipe object containing the updated details.</param>
    /// <returns>A task that represents the asynchronous operation.</returns>
    Task ModifyRecipeAsync(Recipe recipe);

    /// <summary>
    /// Retrieves a recipe by its identifier asynchronously.
    /// </summary>
    /// <param name="id">The identifier of the recipe to retrieve.</param>
    /// <returns>A task that represents the asynchronous operation and contains the recipe.</returns>
    Task<Recipe> GetRecipeByIdAsync(string id);

    /// <summary>
    /// Retrieves the names of recipes that contain a specific ingredient.
    /// </summary>
    /// <param name="ingredientId">The identifier of the ingredient used to filter the recipes.</param>
    /// <returns>A task that represents the asynchronous operation and contains a list of recipe names.</returns>
    Task<List<string>> GetRecipeNamesThatContainIngredient(string ingredientId);
}
