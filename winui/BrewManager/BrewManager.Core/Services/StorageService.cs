using Azure.Storage.Blobs;
using BrewManager.Core.Contracts.Services;

namespace BrewManager.Core.Services;

public class StorageService : IStorageService
{
    private readonly BlobServiceClient _blobServiceClient = new(Secrets.StorageConnectionString);


    public async Task<Uri> UploadIngredientImageAsync(string fileName, Stream stream)
    {
        var containerClient = _blobServiceClient.GetBlobContainerClient("ingredients");
        BlobClient blobClient = containerClient.GetBlobClient(fileName);
        await blobClient.UploadAsync(stream, true);
        return blobClient.Uri;
    }

    public async Task<Uri> UploadRecipeImageAsync(string fileName, Stream stream)
    {
        var containerClient = _blobServiceClient.GetBlobContainerClient("recipes");
        BlobClient blobClient = containerClient.GetBlobClient(fileName);
        await blobClient.UploadAsync(stream, true);
        return blobClient.Uri;
    }
}
