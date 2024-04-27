using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;
using BrewManager.Core.Contracts.Services;
using BrewManager.Core.Models;

namespace BrewManager.Core.Services;
public class ScheduledBrewingService : IScheduledBrewingService
{
    private readonly IRecipeService recipeService;
    private readonly IIngredientService ingredientService;

    public ScheduledBrewingService(IRecipeService recipeService, IIngredientService ingredientService)
    {
        this.recipeService = recipeService;
        this.ingredientService = ingredientService;
    }

    public async Task CompleteScheduledBrewing(ScheduledBrewing scheduledBrewing)
    {
        using var client = new HttpClient();
        await client.DeleteAsync($"{Secrets.BaseUrl}/scheduled-brews/{scheduledBrewing.Id}");
    }

    public async Task DeleteScheduledBrewingAsync(ScheduledBrewing scheduledBrewing)
    {
        using var client = new HttpClient();
        await client.DeleteAsync($"{Secrets.BaseUrl}/scheduled-brews/{scheduledBrewing.Id}");
        foreach (var ingredient in scheduledBrewing.Recipe.Ingredients)
        {
            ingredient.Ingredient.Stock += ingredient.Amount;
            await ingredientService.UpdateIngredientAsync(ingredient.Ingredient);
        }
    }

    public async Task<List<ScheduledBrewing>> GetScheduledBrewingsAsync()
    {
        using var client = new HttpClient();
        var scheduledBrewingDtos = await client.GetFromJsonAsync<List<ScheduledBrewingDto>>($"{Secrets.BaseUrl}/scheduled-brews");
        var recipes = await recipeService.GetRecipesAsync();

        return mapFromScheduledBrewingDtosAndRecipesToScheduledBrewing(scheduledBrewingDtos, recipes);
    }

    public async Task PostScheduledBrewingAsync(ScheduledBrewingPostDto scheduledBrewing)
    {
        using var client = new HttpClient();
        await client.PostAsJsonAsync($"{Secrets.BaseUrl}/scheduled-brews", scheduledBrewing);
        var recipe = await recipeService.GetRecipeByIdAsync(scheduledBrewing.Recipe);
        foreach (var ingredient in recipe.Ingredients)
        {
            ingredient.Ingredient.Stock -= ingredient.Amount;
            await ingredientService.UpdateIngredientAsync(ingredient.Ingredient);
        }
    }

    private List<ScheduledBrewing> mapFromScheduledBrewingDtosAndRecipesToScheduledBrewing(List<ScheduledBrewingDto> scheduledBrewingDtos, List<Recipe> recipes)
    {
        var result = new List<ScheduledBrewing>();
        foreach(var dto in scheduledBrewingDtos)
        {
            result.Add(new ScheduledBrewing
            {
                Id = dto.Id,
                Date = dto.Date,
                Recipe = recipes.FirstOrDefault(r => r.Id == dto.Recipe)
            });
        }

        return result;
    }
}
