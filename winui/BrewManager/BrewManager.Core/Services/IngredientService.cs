using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;
using BrewManager.Core.Contracts.Services;
using BrewManager.Core.Models;

namespace BrewManager.Core.Services;
public class IngredientService : IIngredientService
{
    private readonly string _baseUrl = "http://localhost:3000";

    public async Task<List<Ingredient>> GetInventoryItemsAsync()
    {
        using var client = new HttpClient();
        return await client.GetFromJsonAsync<List<Ingredient>>($"{_baseUrl}/inventory");
    }
}
