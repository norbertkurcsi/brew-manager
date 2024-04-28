using System.Net.Http.Json;
using BrewManager.Core.Contracts.Services;
using BrewManager.Core.Models;

namespace BrewManager.Core.Services;

/// <summary>
/// Service responsible for managing scheduled brewings within the application.
/// </summary>
public class ScheduledBrewingService : IScheduledBrewingService
{
    private readonly IRecipeService recipeService;
    private readonly IIngredientService ingredientService;

    /// <summary>
    /// Initializes a new instance of the ScheduledBrewingService with necessary service dependencies.
    /// </summary>
    /// <param name="recipeService">Service to manage recipes.</param>
    /// <param name="ingredientService">Service to manage ingredients.</param>
    public ScheduledBrewingService(IRecipeService recipeService, IIngredientService ingredientService)
    {
        this.recipeService = recipeService;
        this.ingredientService = ingredientService;
    }

    /// <summary>
    /// Completes a scheduled brewing by deleting it from the system.
    /// </summary>
    /// <param name="scheduledBrewing">The scheduled brewing to complete.</param>
    public async Task CompleteScheduledBrewing(ScheduledBrewing scheduledBrewing)
    {
        using var client = new HttpClient();
        await client.DeleteAsync($"{Secrets.BaseUrl}/scheduled-brews/{scheduledBrewing.Id}");
    }

    /// <summary>
    /// Deletes a scheduled brewing and restores the associated ingredient stocks.
    /// </summary>
    /// <param name="scheduledBrewing">The scheduled brewing to delete.</param>
    public async Task DeleteScheduledBrewingAsync(ScheduledBrewing scheduledBrewing)
    {
        using var client = new HttpClient();
        await client.DeleteAsync($"{Secrets.BaseUrl}/scheduled-brews/{scheduledBrewing.Id}");

        // Replenish stocks for ingredients associated with the deleted brewing.
        foreach (var ingredient in scheduledBrewing.Recipe.Ingredients)
        {
            ingredient.Ingredient.Stock += ingredient.Amount;
            await ingredientService.UpdateIngredientAsync(ingredient.Ingredient);
        }
    }

    /// <summary>
    /// Retrieves all scheduled brewings from the server.
    /// </summary>
    /// <returns>A list of all scheduled brewings.</returns>
    public async Task<List<ScheduledBrewing>> GetScheduledBrewingsAsync()
    {
        using var client = new HttpClient();
        var scheduledBrewingDtos = await client.GetFromJsonAsync<List<ScheduledBrewingDto>>($"{Secrets.BaseUrl}/scheduled-brews");
        var recipes = await recipeService.GetRecipesAsync();

        return mapFromScheduledBrewingDtosAndRecipesToScheduledBrewing(scheduledBrewingDtos, recipes);
    }

    /// <summary>
    /// Schedules a new brewing session by reducing the ingredient stocks accordingly.
    /// </summary>
    /// <param name="scheduledBrewing">The scheduled brewing session details.</param>
    public async Task PostScheduledBrewingAsync(ScheduledBrewingPostDto scheduledBrewing)
    {
        using var client = new HttpClient();
        await client.PostAsJsonAsync($"{Secrets.BaseUrl}/scheduled-brews", scheduledBrewing);
        var recipe = await recipeService.GetRecipeByIdAsync(scheduledBrewing.Recipe);

        // Decrease stock for ingredients used in the new scheduled brewing.
        foreach (var ingredient in recipe.Ingredients)
        {
            ingredient.Ingredient.Stock -= ingredient.Amount;
            await ingredientService.UpdateIngredientAsync(ingredient.Ingredient);
        }
    }

    /// <summary>
    /// Maps data transfer objects and recipes to ScheduledBrewing entities.
    /// </summary>
    /// <param name="scheduledBrewingDtos">List of scheduled brewing DTOs.</param>
    /// <param name="recipes">List of recipes.</param>
    /// <returns>A list of mapped ScheduledBrewing entities.</returns>
    private List<ScheduledBrewing> mapFromScheduledBrewingDtosAndRecipesToScheduledBrewing(List<ScheduledBrewingDto> scheduledBrewingDtos, List<Recipe> recipes)
    {
        return scheduledBrewingDtos.Select(dto => new ScheduledBrewing
        {
            Id = dto.Id,
            Date = dto.Date,
            Recipe = recipes.FirstOrDefault(r => r.Id == dto.Recipe)
        }).ToList();
    }
}
