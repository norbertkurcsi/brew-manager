using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BrewManager.Core.Contracts.Services;
public interface IStorageService
{
    public Task<Uri> UploadIngredientImageAsync(string fileName, Stream stream);
    public Task<Uri> UploadRecipeImageAsync(string fileName, Stream stream);
}
