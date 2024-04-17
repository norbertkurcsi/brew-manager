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
}
