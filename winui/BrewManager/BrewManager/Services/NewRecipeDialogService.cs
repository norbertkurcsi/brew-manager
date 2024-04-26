using BrewManager.Contracts.Services;
using BrewManager.Core.Contracts.Services;
using BrewManager.Core.Models;
using BrewManager.Views;

namespace BrewManager.Services;
public class NewRecipeDialogService : INewRecipeDialogService
{
    private readonly IRecipeService recipeService;
    private readonly IStorageService storageService;

    private bool canEdit = false;

    public NewRecipeDialogService(IRecipeService recipeService, IStorageService storageService)
    {
        this.recipeService = recipeService;
        this.storageService = storageService;
        Image = Stream.Null;
        Title = string.Empty;
    }
    private Stream image;
    public Stream Image
    {
        get => image;
        set
        {
            if (canEdit)
            {
                image = value;
            }
        }
    }

    private string title;
    public string Title
    {
        get => title;
        set
        {
            if (canEdit)
            {
                title = value;
            }
        }
    }

    public async Task Save()
    {
        canEdit = false;
        var url = "https://brewmanager.blob.core.windows.net/ingredients/anonym.jpeg";
        if(string.IsNullOrEmpty(Title))
        {
            title = "Change Title";
        }
        if (Image != Stream.Null && Image != null) 
        {
            var uri = await storageService.UploadRecipeImageAsync($"{Guid.NewGuid()}.jpg", Image);
            url = uri.ToString();
        }
        
        var dto = new RecipePostDto
        {
            Name = Title,
            ImageUrl = url.ToString(),
            Ingredients = new()
        };
        await recipeService.PostRecipeAsync(dto);
        
    }

    public NewRecipeDialogContent GetDialogContent()
    {
        canEdit = true;
        return new NewRecipeDialogContent(this);
    }

    public void Clear()
    {
        canEdit = true;
        Image = Stream.Null;
        Title = string.Empty;
        canEdit = false;
    }
}
