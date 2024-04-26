using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BrewManager.Core.Models;

namespace BrewManager.Core.Contracts.Services;
public interface IRecipeService
{
    public Task<List<Recipe>> GetRecipesAsync();
    public Task PostRecipeAsync(RecipePostDto recipe);
    public Task DeleteRecipeAsync(string id);
}
