using System;
using System.Collections.Generic;
using System.ComponentModel;
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

    public event EventHandler<SnackbarEventArgs> RequestResult;

    private void OnRequestResult(string message, bool isSuccess)
    {
        RequestResult?.Invoke(this, new SnackbarEventArgs(message, isSuccess));
    }

    public async Task<InventoryGetResponse> GetInventoryItemsAsync(int perPage, int page, string sort, ListSortDirection listSortDirection)
    {
        using var client = new HttpClient();

        UriBuilder uriBuilder = new UriBuilder($"{_baseUrl}/inventory")
        {
            Query = $"_page={page}&_per_page={perPage}"
        };

        if(sort != "<none>")
        {
            sort = char.ToLower(sort[0]) + sort.Substring(1);

            if (listSortDirection == ListSortDirection.Descending)
            {
                sort = "-" + sort;
            }
            uriBuilder.Query += $"&_sort={sort}";
        }

        return await client.GetFromJsonAsync<InventoryGetResponse>(uriBuilder.Uri);
    }

    public async Task UpdateIngredientAsync(Ingredient ingredient)
    {
        using var client = new HttpClient();

        var response = await client.PatchAsJsonAsync($"{_baseUrl}/inventory/{ingredient.Id}", ingredient);

        if (!response.IsSuccessStatusCode)
        {
            OnRequestResult("Request failed, see application logs", false);
        }
        else
        {
            OnRequestResult("Inventory item successfully updated", true);
        }
    }

    public async Task CreateIngredientAsync(Ingredient ingredient)
    {
        var postIngredient = new IngredientPostDto()
        {
            Name = ingredient.Name,
            Threshold = ingredient.Threshold,
            Stock = ingredient.Stock,
            ImageUrl = ingredient.ImageUrl,
        };
        using var client = new HttpClient();

        var response = await client.PostAsJsonAsync($"{_baseUrl}/inventory", postIngredient);

        if (!response.IsSuccessStatusCode)
        {
            OnRequestResult("Request failed, see application logs", false);
        }
        else
        {
            OnRequestResult("Inventory item successfully added", true);
        }
    }

    public async Task DeleteIngredientAsync(string id)
    {
        using var client = new HttpClient();

        var response = await client.DeleteAsync($"{_baseUrl}/inventory/{id}");

        if (!response.IsSuccessStatusCode)
        {
            OnRequestResult("Request failed, see application logs", false);
        }
        else
        {
            OnRequestResult("Inventory item successfully deleted", true);
        }
    }

}
