using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BrewManager.Core.Models;
using BrewManager.Core.Services;

namespace BrewManager.Core.Contracts.Services;

public interface IIngredientService
{
    public event EventHandler<SnackbarEventArgs> RequestResult;
    public Task<InventoryGetResponse> GetInventoryItemsPagedAsync(int perPage, int page, string sort, ListSortDirection listSortDirection);
    public Task<List<Ingredient>> GetInventoryItemsAsync();
    public Task UpdateIngredientAsync(Ingredient ingredient);
    public Task CreateIngredientAsync(Ingredient ingredient);
    public Task DeleteIngredientAsync(string id);
}
