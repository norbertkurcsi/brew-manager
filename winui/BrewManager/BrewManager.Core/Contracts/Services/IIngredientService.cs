using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Threading.Tasks;
using BrewManager.Core.Models;
using BrewManager.Core.Services;

namespace BrewManager.Core.Contracts.Services;

/// <summary>
/// Defines an interface for managing ingredient-related operations in the inventory system.
/// This includes retrieving, creating, updating, and deleting ingredients.
/// </summary>
public interface IIngredientService
{
    /// <summary>
    /// Event triggered when an operation results in a significant outcome that should be communicated to the user.
    /// </summary>
    event EventHandler<SnackbarEventArgs> RequestResult;

    /// <summary>
    /// Retrieves a paginated list of ingredients asynchronously.
    /// </summary>
    /// <param name="perPage">The number of ingredients per page.</param>
    /// <param name="page">The current page number to retrieve.</param>
    /// <param name="sort">The property name to sort by.</param>
    /// <param name="listSortDirection">The direction of the sorting (Ascending or Descending).</param>
    /// <returns>A task that represents the asynchronous operation, returning the paginated list of ingredients.</returns>
    Task<InventoryGetResponse> GetInventoryItemsPagedAsync(int perPage, int page, string sort, ListSortDirection listSortDirection);

    /// <summary>
    /// Retrieves all inventory items asynchronously.
    /// </summary>
    /// <returns>A task that represents the asynchronous operation, returning a list of all ingredients.</returns>
    Task<List<Ingredient>> GetInventoryItemsAsync();

    /// <summary>
    /// Updates the details of an existing ingredient asynchronously.
    /// </summary>
    /// <param name="ingredient">The ingredient with updated information.</param>
    /// <returns>A task that represents the asynchronous operation.</returns>
    Task UpdateIngredientAsync(Ingredient ingredient);

    /// <summary>
    /// Creates a new ingredient in the inventory asynchronously.
    /// </summary>
    /// <param name="ingredient">The new ingredient to add to the inventory.</param>
    /// <returns>A task that represents the asynchronous operation.</returns>
    Task CreateIngredientAsync(Ingredient ingredient);

    /// <summary>
    /// Deletes an ingredient from the inventory based on its identifier asynchronously.
    /// </summary>
    /// <param name="id">The identifier of the ingredient to delete.</param>
    /// <returns>A task that represents the asynchronous operation.</returns>
    Task DeleteIngredientAsync(string id);
}
