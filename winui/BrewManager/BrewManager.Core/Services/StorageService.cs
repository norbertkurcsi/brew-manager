using Azure.Storage.Blobs;
using BrewManager.Core.Contracts.Services;
namespace BrewManager.Core.Services;

/// <summary>
/// Service for managing storage operations, specifically for uploading images to Azure Blob Storage.
/// </summary>
public class StorageService : IStorageService
{
    private readonly BlobServiceClient _blobServiceClient;

    /// <summary>
    /// Initializes a new instance of the <see cref="StorageService"/> class with a connection to Azure Blob Storage.
    /// </summary>
    public StorageService()
    {
        _blobServiceClient = new BlobServiceClient(Secrets.StorageConnectionString);
    }

    /// <summary>
    /// Uploads an image for an ingredient to Azure Blob Storage and returns the URI of the uploaded image.
    /// </summary>
    /// <param name="fileName">The name of the file to be stored, including the extension.</param>
    /// <param name="stream">The stream containing the image data to be uploaded.</param>
    /// <returns>A task that returns the URI of the uploaded image upon completion.</returns>
    public async Task<Uri> UploadIngredientImageAsync(string fileName, Stream stream)
    {
        var containerClient = _blobServiceClient.GetBlobContainerClient("ingredients");
        var blobClient = containerClient.GetBlobClient(fileName);
        await blobClient.UploadAsync(stream, overwrite: true);
        return blobClient.Uri;
    }

    /// <summary>
    /// Uploads an image for a recipe to Azure Blob Storage and returns the URI of the uploaded image.
    /// </summary>
    /// <param name="fileName">The name of the file to be stored, including the extension.</param>
    /// <param name="stream">The stream containing the image data to be uploaded.</param>
    /// <returns>A task that returns the URI of the uploaded image upon completion.</returns>
    public async Task<Uri> UploadRecipeImageAsync(string fileName, Stream stream)
    {
        var containerClient = _blobServiceClient.GetBlobContainerClient("recipes");
        var blobClient = containerClient.GetBlobClient(fileName);
        await blobClient.UploadAsync(stream, overwrite: true);
        return blobClient.Uri;
    }
}
