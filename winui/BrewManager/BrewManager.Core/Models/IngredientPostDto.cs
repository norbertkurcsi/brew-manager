namespace BrewManager.Core.Models;

/// <summary>
/// Represents a data transfer object (DTO) used for creating or updating ingredients.
/// </summary>
public class IngredientPostDto
{
    /// <summary>
    /// Gets or sets the name of the ingredient.
    /// </summary>
    public string Name
    {
        get; set;
    }

    /// <summary>
    /// Gets or sets the current stock quantity of the ingredient.
    /// </summary>
    public int Stock
    {
        get; set;
    }

    /// <summary>
    /// Gets or sets the threshold stock quantity of the ingredient.
    /// </summary>
    public int Threshold
    {
        get; set;
    }

    /// <summary>
    /// Gets or sets the URL of the image associated with the ingredient.
    /// </summary>
    public string ImageUrl
    {
        get; set;
    }
}
