using System.ComponentModel;
using System.Net.Http.Json;
using BrewManager.Core.Contracts.Services;
using BrewManager.Core.Models;

namespace BrewManager.Core.Services;

/// <summary>
/// Provides services for managing ingredients in the inventory system.
/// </summary>
public class IngredientService : IIngredientService
{
    public event EventHandler<SnackbarEventArgs> RequestResult;

    /// <summary>
    /// Triggers the RequestResult event to notify about the outcome of a network request.
    /// </summary>
    /// <param name="message">The message to display in the notification.</param>
    /// <param name="isSuccess">Indicates whether the request was successful or not.</param>
    private void OnRequestResult(string message, bool isSuccess)
    {
        RequestResult?.Invoke(this, new SnackbarEventArgs(message, isSuccess));
    }

    /// <summary>
    /// Retrieves a paginated list of inventory items asynchronously.
    /// </summary>
    /// <param name="perPage">The number of items per page.</param>
    /// <param name="page">The current page number.</param>
    /// <param name="sort">The property by which to sort the items.</param>
    /// <param name="listSortDirection">The direction of the sort (ascending or descending).</param>
    /// <returns>A task that returns the paginated list of ingredients.</returns>
    public async Task<InventoryGetResponse> GetInventoryItemsPagedAsync(int perPage, int page, string sort, ListSortDirection listSortDirection)
    {
        using var client = new HttpClient();

        UriBuilder uriBuilder = new UriBuilder($"{Secrets.BaseUrl}/inventory")
        {
            Query = $"_page={page}&_per_page={perPage}"
        };

        if (sort != "<none>")
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

    /// <summary>
    /// Retrieves all inventory items asynchronously.
    /// </summary>
    /// <returns>A task that returns the list of all ingredients.</returns>
    public async Task<List<Ingredient>> GetInventoryItemsAsync()
    {
        using var client = new HttpClient();
        return await client.GetFromJsonAsync<List<Ingredient>>($"{Secrets.BaseUrl}/inventory");
    }

    /// <summary>
    /// Updates an existing ingredient in the inventory asynchronously.
    /// </summary>
    /// <param name="ingredient">The ingredient to update.</param>
    /// <returns>A task that completes when the update is done.</returns>
    public async Task UpdateIngredientAsync(Ingredient ingredient)
    {
        using var client = new HttpClient();

        var response = await client.PatchAsJsonAsync($"{Secrets.BaseUrl}/inventory/{ingredient.Id}", ingredient);

        if (!response.IsSuccessStatusCode)
        {
            OnRequestResult("Request failed, see application logs", false);
        }
        else
        {
            OnRequestResult("Inventory item successfully updated", true);
        }
    }

    /// <summary>
    /// Adds a new ingredient to the inventory asynchronously.
    /// </summary>
    /// <param name="ingredient">The ingredient to add.</param>
    /// <returns>A task that completes when the ingredient is added.</returns>
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

        var response = await client.PostAsJsonAsync($"{Secrets.BaseUrl}/inventory", postIngredient);

        if (!response.IsSuccessStatusCode)
        {
            OnRequestResult("Request failed, see application logs", false);
        }
        else
        {
            OnRequestResult("Inventory item successfully added", true);
        }
    }

    /// <summary>
    /// Deletes an ingredient from the inventory based on its ID asynchronously.
    /// </summary>
    /// <param name="id">The ID of the ingredient to delete.</param>
    /// <returns>A task that completes when the ingredient is deleted.</returns>
    public async Task DeleteIngredientAsync(string id)
    {
        using var client = new HttpClient();

        var response = await client.DeleteAsync($"{Secrets.BaseUrl}/inventory/{id}");

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
