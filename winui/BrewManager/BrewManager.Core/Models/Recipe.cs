

using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;

namespace BrewManager.Core.Models;

public partial class Recipe: ObservableObject
{
    [ObservableProperty]
    public string id;
    [ObservableProperty]
    public string name;
    [ObservableProperty]
    public string imageUrl;

    [ObservableProperty]
    public ObservableCollection<RecipeIngredient> ingredients;
}

public class RecipeDto
{
    public string Id
    {
        get; set;
    }
    public string Name
    {
        get; set;
    }
    public string ImageUrl
    {
        get; set;
    }
    public List<RecipeIngredientHeader> Ingredients
    {
        get; set;
    }
}

public class RecipePostDto
{
    public string Name
    {
        get; set;
    }
    public string ImageUrl
    {
        get; set;
    }
    public List<RecipeIngredientHeader> Ingredients
    {
        get; set;
    }
}

public class RecipeIngredientHeader
{
    public string Id
    {
        get; set;
    }
    public int Amount
    {
        get; set;
    }
}

public class RecipeIngredient
{
    public Ingredient Ingredient
    {
    get; set; 
    }
    public int Amount
    {
        get; set;
    }
}

