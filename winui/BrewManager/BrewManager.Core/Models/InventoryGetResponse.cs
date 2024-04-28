namespace BrewManager.Core.Models;

/// <summary>
/// Represents a response containing inventory information.
/// </summary>
public class InventoryGetResponse
{
    /// <summary>
    /// Gets or sets the total number of pages.
    /// </summary>
    public int Pages
    {
        get; set;
    }

    /// <summary>
    /// Gets or sets the data containing inventory items.
    /// </summary>
    public List<Ingredient> Data {
        get; set;
    }
}