namespace BrewManager.Core.Contracts.Services;

/// <summary>
/// Defines an interface for handling storage operations related to uploading images for ingredients and recipes.
/// </summary>
public interface IStorageService
{
    /// <summary>
    /// Uploads an image for an ingredient asynchronously.
    /// </summary>
    /// <param name="fileName">The name that should be used to save the file in storage.</param>
    /// <param name="stream">The stream containing the image data to be uploaded.</param>
    /// <returns>A task that represents the asynchronous operation, returning the URI of the uploaded image.</returns>
    Task<Uri> UploadIngredientImageAsync(string fileName, Stream stream);

    /// <summary>
    /// Uploads an image for a recipe asynchronously.
    /// </summary>
    /// <param name="fileName">The name that should be used to save the file in storage.</param>
    /// <param name="stream">The stream containing the image data to be uploaded.</param>
    /// <returns>A task that represents the asynchronous operation, returning the URI of the uploaded image.</returns>
    Task<Uri> UploadRecipeImageAsync(string fileName, Stream stream);
}
