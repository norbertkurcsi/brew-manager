using CommunityToolkit.Mvvm.ComponentModel;

namespace BrewManager.Core.Models;

/// <summary>
/// Represents an ingredient used in brewing.
/// </summary>
public partial class Ingredient : ObservableObject
{
    /// <summary>
    /// Gets or sets the unique identifier of the ingredient.
    /// </summary>
    [ObservableProperty]
    public string id;

    /// <summary>
    /// Gets or sets the name of the ingredient.
    /// </summary>
    [ObservableProperty]
    public string name;

    /// <summary>
    /// Gets or sets the current stock quantity of the ingredient.
    /// </summary>
    [ObservableProperty]
    public int stock;

    /// <summary>
    /// Gets or sets the threshold stock quantity of the ingredient.
    /// </summary>
    [ObservableProperty]
    public int threshold;

    /// <summary>
    /// Gets or sets the URL of the image associated with the ingredient.
    /// </summary>
    [ObservableProperty]
    public string imageUrl;
}
