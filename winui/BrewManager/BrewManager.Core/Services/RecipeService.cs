using System.Collections.ObjectModel;
using System.Linq;
using System.Net.Http.Json;
using System.Threading.Tasks;
using BrewManager.Core.Contracts.Services;
using BrewManager.Core.Models;
using System.Net.Http;

namespace BrewManager.Core.Services;

/// <summary>
/// Provides services for managing recipes within the application.
/// This service handles creation, retrieval, update, and deletion of recipes.
/// </summary>
public class RecipeService : IRecipeService
{
    private readonly IIngredientService ingredientService;

    /// <summary>
    /// Constructs the RecipeService with a dependency on IIngredientService.
    /// </summary>
    /// <param name="ingredientService">Service to manage ingredient data.</param>
    public RecipeService(IIngredientService ingredientService)
    {
        this.ingredientService = ingredientService;
    }

    /// <summary>
    /// Retrieves all recipes from the server.
    /// </summary>
    /// <returns>A list of recipes with their complete information including related ingredients.</returns>
    public async Task<List<Recipe>> GetRecipesAsync()
    {
        using var client = new HttpClient();
        var recipeDtos = await client.GetFromJsonAsync<List<RecipeDto>>($"{Secrets.BaseUrl}/recipes");
        var ingredients = await ingredientService.GetInventoryItemsAsync();

        return mapFromRecipeDtosAndIngredients(recipeDtos, ingredients);
    }

    /// <summary>
    /// Retrieves recipes that are ready to be brewed, based on ingredient stock levels.
    /// </summary>
    /// <returns>A list of recipes that can be brewed with current stock levels.</returns>
    public async Task<List<Recipe>> GetRecipesReadyForBrewingAsync()
    {
        var allRecipes = await GetRecipesAsync();
        return allRecipes.FindAll(recipe => recipe.Ingredients.All(ri => ri.Amount <= ri.Ingredient.Stock));
    }

    /// <summary>
    /// Retrieves a single recipe by its identifier.
    /// </summary>
    /// <param name="recipeId">The identifier of the recipe.</param>
    /// <returns>The recipe matching the identifier, if found.</returns>
    public async Task<Recipe> GetRecipeByIdAsync(string recipeId)
    {
        using var client = new HttpClient();
        var recipeDto = await client.GetFromJsonAsync<RecipeDto>($"{Secrets.BaseUrl}/recipes/{recipeId}");
        var ingredients = await ingredientService.GetInventoryItemsAsync();

        var recipes = mapFromRecipeDtosAndIngredients(new List<RecipeDto> { recipeDto }, ingredients);
        return recipes.First();
    }

    /// <summary>
    /// Updates a recipe's details.
    /// </summary>
    /// <param name="recipe">The recipe to update.</param>
    public async Task ModifyRecipeAsync(Recipe recipe)
    {
        using var client = new HttpClient();
        var recipeDto = mapRecipeToRecipeDto(recipe);
        await client.PatchAsJsonAsync($"{Secrets.BaseUrl}/recipes/{recipe.Id}", recipeDto);
    }

    /// <summary>
    /// Creates a new recipe.
    /// </summary>
    /// <param name="recipe">The recipe data transfer object containing the recipe details.</param>
    public async Task PostRecipeAsync(RecipePostDto recipe)
    {
        using var client = new HttpClient();
        await client.PostAsJsonAsync($"{Secrets.BaseUrl}/recipes", recipe);
    }

    /// <summary>
    /// Deletes a recipe by its identifier.
    /// </summary>
    /// <param name="id">The identifier of the recipe to delete.</param>
    public async Task DeleteRecipeAsync(string id)
    {
        using var client = new HttpClient();
        await client.DeleteAsync($"{Secrets.BaseUrl}/recipes/{id}");
    }

    /// <summary>
    /// Retrieves the names of all recipes that contain a specific ingredient.
    /// </summary>
    /// <param name="ingredientId">The ID of the ingredient to search for within recipes.</param>
    /// <returns>A task that returns a list of recipe names containing the specified ingredient.</returns>
    public async Task<List<string>> GetRecipeNamesThatContainIngredient(string ingredientId)
    {
        using var client = new HttpClient();
        var result = new List<string>();

        var recipes = await GetRecipesAsync();
        foreach (var recipe in recipes)
        {
            foreach (var ingredient in recipe.Ingredients)
            {
                if (ingredient.Ingredient.Id == ingredientId)
                {
                    result.Add(recipe.Name);
                    break;
                }
            }
        }

        return result;
    }

    /// <summary>
    /// Maps recipe DTOs and their ingredients to Recipe model instances.
    /// </summary>
    /// <param name="recipeDtos">List of recipe DTOs.</param>
    /// <param name="ingredients">List of available ingredients.</param>
    /// <returns>List of fully constructed recipes.</returns>
    private List<Recipe> mapFromRecipeDtosAndIngredients(List<RecipeDto> recipeDtos, List<Ingredient> ingredients)
    {
        return recipeDtos.Select(recipeDto => new Recipe
        {
            Id = recipeDto.Id,
            Name = recipeDto.Name,
            ImageUrl = recipeDto.ImageUrl,
            Ingredients = new ObservableCollection<RecipeIngredient>(
                recipeDto.Ingredients.Select(dto => new RecipeIngredient
                {
                    Ingredient = ingredients.FirstOrDefault(ing => ing.Id == dto.Id),
                    Amount = dto.Amount
                }))
        }).ToList();
    }

    /// <summary>
    /// Converts a Recipe model to a RecipeDto for transmission.
    /// </summary>
    /// <param name="recipe">The recipe model to convert.</param>
    /// <returns>The corresponding RecipeDto.</returns>
    private RecipeDto mapRecipeToRecipeDto(Recipe recipe)
    {
        return new RecipeDto
        {
            Id = recipe.Id,
            Name = recipe.Name,
            ImageUrl = recipe.ImageUrl,
            Ingredients = recipe.Ingredients.Select(ri => new RecipeIngredientHeader { Id = ri.Ingredient.Id, Amount = ri.Amount }).ToList()
        };
    }
}
