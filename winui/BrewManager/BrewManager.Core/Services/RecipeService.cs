using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;
using BrewManager.Core.Contracts.Services;
using BrewManager.Core.Models;

namespace BrewManager.Core.Services;
public class RecipeService : IRecipeService
{
    private readonly IIngredientService ingredientService;

    public RecipeService(IIngredientService ingredientService)
    {
        this.ingredientService = ingredientService;
    }

    public async Task<List<Recipe>> GetRecipesAsync()
    {
        using var client = new HttpClient();
        var recipeDtos = await client.GetFromJsonAsync<List<RecipeGetDto>>($"{Secrets.BaseUrl}/recipes");
        var ingredients = await ingredientService.GetInventoryItemsAsync();

        var recipes = mapFromRecipeDtosAndIngredients(recipeDtos, ingredients);
        return recipes;
    }

    private List<Recipe> mapFromRecipeDtosAndIngredients(List<RecipeGetDto> recipeDtos, List<Ingredient> ingredients)
    {

        var recipes = new List<Recipe>();

        foreach (var recipeDto in recipeDtos)
        {
            var recipe = new Recipe
            {
                Id = recipeDto.Id,
                Name = recipeDto.Name,
                ImageUrl = recipeDto.ImageUrl,
                Ingredients = new List<RecipeIngredient>()
            };

            foreach (var ingredientDto in recipeDto.Ingredients)
            {
                var inventoryItem = ingredients.FirstOrDefault(item => item.Id == ingredientDto.Id);

                if (inventoryItem != null)
                {
                    var ingredient = new Ingredient
                    {
                        Id = inventoryItem.Id,
                        Name = inventoryItem.Name,
                        Stock = inventoryItem.Stock,
                        Threshold = inventoryItem.Threshold,
                        ImageUrl = inventoryItem.ImageUrl
                    };
                    var recipeIngredient = new RecipeIngredient
                    {
                        Ingredient = ingredient,
                        Amount = ingredientDto.Amount
                    };

                    recipe.Ingredients.Add(recipeIngredient);
                }
            }

            recipes.Add(recipe);
        }

        return recipes;
    }
}
