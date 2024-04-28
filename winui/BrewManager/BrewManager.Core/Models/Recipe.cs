using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;

namespace BrewManager.Core.Models;

/// <summary>
/// Represents a recipe with its details and ingredients.
/// </summary>
public partial class Recipe : ObservableObject
{
    [ObservableProperty]
    private string id;

    [ObservableProperty]
    private string name;

    [ObservableProperty]
    private string imageUrl;

    /// <summary>
    /// Collection of ingredients used in the recipe.
    /// </summary>
    [ObservableProperty]
    private ObservableCollection<RecipeIngredient> ingredients;
}

/// <summary>
/// Data transfer object for recipe information.
/// Used to transfer data between layers without carrying business logic or behavior.
/// </summary>
public class RecipeDto
{
    /// <summary>
    /// Unique identifier for the recipe.
    /// </summary>
    public string Id
    {
        get; set;
    }

    /// <summary>
    /// Name of the recipe.
    /// </summary>
    public string Name
    {
        get; set;
    }

    /// <summary>
    /// URL of the image representing the recipe.
    /// </summary>
    public string ImageUrl
    {
        get; set;
    }

    /// <summary>
    /// List of ingredients involved in the recipe, represented with simplified header information.
    /// </summary>
    public List<RecipeIngredientHeader> Ingredients
    {
        get; set;
    }
}

/// <summary>
/// Data transfer object for posting recipe information.
/// It is used when creating or updating recipes in the system.
/// </summary>
public class RecipePostDto
{
    /// <summary>
    /// Name of the recipe to be created or updated.
    /// </summary>
    public string Name
    {
        get; set;
    }

    /// <summary>
    /// URL of the image to associate with the recipe.
    /// </summary>
    public string ImageUrl
    {
        get; set;
    }

    /// <summary>
    /// List of ingredients and their amounts required for the recipe.
    /// </summary>
    public List<RecipeIngredientHeader> Ingredients
    {
        get; set;
    }
}

/// <summary>
/// Represents a simplified header version of a recipe ingredient,
/// providing only essential information needed for listings or summaries.
/// </summary>
public class RecipeIngredientHeader
{
    /// <summary>
    /// Unique identifier for the ingredient.
    /// </summary>
    public string Id
    {
        get; set;
    }

    /// <summary>
    /// Amount of the ingredient required.
    /// </summary>
    public int Amount
    {
        get; set;
    }
}

/// <summary>
/// Represents an ingredient within a recipe, including the ingredient details and the amount used.
/// </summary>
public class RecipeIngredient
{
    /// <summary>
    /// The ingredient used in the recipe.
    /// </summary>
    public Ingredient Ingredient
    {
        get; set;
    }

    /// <summary>
    /// Amount of the ingredient used in the recipe.
    /// </summary>
    public int Amount
    {
        get; set;
    }
}
