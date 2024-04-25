

namespace BrewManager.Core.Models;

public class Recipe
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

    public List<RecipeIngredient> Ingredients
    {
        get; set;
    }
}

public class RecipeGetDto
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

public class RecipeIngredientHeader
{
    public string Id
    {
        get; set;
    }
    public float Amount
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
    public float Amount
    {
        get; set;
    }
}

