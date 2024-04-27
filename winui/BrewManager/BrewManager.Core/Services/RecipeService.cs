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

    public async Task DeleteRecipeAsync(string id)
    {
        using var client = new HttpClient();
        await client.DeleteAsync($"{Secrets.BaseUrl}/recipes/{id}");
    }

    public async Task<List<Recipe>> GetRecipesAsync()
    {
        using var client = new HttpClient();
        var recipeDtos = await client.GetFromJsonAsync<List<RecipeDto>>($"{Secrets.BaseUrl}/recipes");
        var ingredients = await ingredientService.GetInventoryItemsAsync();

        var recipes = mapFromRecipeDtosAndIngredients(recipeDtos, ingredients);
        return recipes;
    }

    public async Task<List<Recipe>> GetRecipesReadyForBrewingAsync()
    {
        using var client = new HttpClient();
        var recipeDtos = await client.GetFromJsonAsync<List<RecipeDto>>($"{Secrets.BaseUrl}/recipes");
        var ingredients = await ingredientService.GetInventoryItemsAsync();

        var recipes = mapFromRecipeDtosAndIngredients(recipeDtos, ingredients);
        recipes = recipes.FindAll(recipe =>
        {
            foreach (var ingredient in recipe.Ingredients)
            {
                if (ingredient.Amount > ingredient.Ingredient.Stock)
                {
                    return false;
                }
            }
            return true;
        });
        return recipes;
    }

    public async Task<Recipe> GetRecipeByIdAsync(string recipe)
    {
        using var client = new HttpClient();
        var recipeDto = await client.GetFromJsonAsync<RecipeDto>($"{Secrets.BaseUrl}/recipes/{recipe}");
        var ingredients = await ingredientService.GetInventoryItemsAsync();

        var recipes = mapFromRecipeDtosAndIngredients(new List<RecipeDto> { recipeDto }, ingredients);
        return recipes.First();
    }

    public async Task ModifyRecipeAsync(Recipe recipe)
    {
        using var client = new HttpClient();
        var recipeDto = mapRecipeToRecipeDto(recipe);
        await client.PatchAsJsonAsync($"{Secrets.BaseUrl}/recipes/{recipe.Id}", recipeDto);
    }

    private RecipeDto mapRecipeToRecipeDto(Recipe recipe)
    {
        var result = new RecipeDto()
        {
            Id = recipe.Id,
            Name = recipe.Name,
            ImageUrl = recipe.ImageUrl,
            Ingredients = new()
        };

        foreach(var ingredient in recipe.Ingredients)
        {
            result.Ingredients.Add(new RecipeIngredientHeader { Amount = ingredient.Amount, Id = ingredient.Ingredient.Id });
        }

        return result;
    }

    public async Task PostRecipeAsync(RecipePostDto recipe)
    {
        using var client = new HttpClient();
        await client.PostAsJsonAsync($"{Secrets.BaseUrl}/recipes", recipe);
    }

    private List<Recipe> mapFromRecipeDtosAndIngredients(List<RecipeDto> recipeDtos, List<Ingredient> ingredients)
    {

        var recipes = new List<Recipe>();

        foreach (var recipeDto in recipeDtos)
        {
            var recipe = new Recipe
            {
                Id = recipeDto.Id,
                Name = recipeDto.Name,
                ImageUrl = recipeDto.ImageUrl,
                Ingredients = new ObservableCollection<RecipeIngredient>()
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
