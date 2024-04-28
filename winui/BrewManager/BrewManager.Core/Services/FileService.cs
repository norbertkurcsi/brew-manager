using System.Text;
using BrewManager.Core.Contracts.Services;
using Newtonsoft.Json;
using System.IO;

namespace BrewManager.Core.Services;

/// <summary>
/// Service to handle file operations such as reading, saving, and deleting JSON data.
/// </summary>
public class FileService : IFileService
{
    /// <summary>
    /// Reads JSON data from a file and deserializes it to the specified type.
    /// </summary>
    /// <typeparam name="T">The type of the object to deserialize to.</typeparam>
    /// <param name="folderPath">The directory path where the file is located.</param>
    /// <param name="fileName">The name of the file to read from.</param>
    /// <returns>The deserialized object of type T from the file, or default(T) if the file does not exist.</returns>
    public T Read<T>(string folderPath, string fileName)
    {
        var path = Path.Combine(folderPath, fileName);
        if (File.Exists(path))
        {
            var json = File.ReadAllText(path);
            return JsonConvert.DeserializeObject<T>(json);
        }

        return default;
    }

    /// <summary>
    /// Serializes an object to JSON and saves it to a file.
    /// </summary>
    /// <typeparam name="T">The type of the object to serialize.</typeparam>
    /// <param name="folderPath">The directory path where the file will be saved.</param>
    /// <param name="fileName">The name of the file to create or overwrite.</param>
    /// <param name="content">The object to serialize to JSON and save.</param>
    public void Save<T>(string folderPath, string fileName, T content)
    {
        if (!Directory.Exists(folderPath))
        {
            Directory.CreateDirectory(folderPath);
        }

        var fileContent = JsonConvert.SerializeObject(content);
        File.WriteAllText(Path.Combine(folderPath, fileName), fileContent, Encoding.UTF8);
    }

    /// <summary>
    /// Deletes a file from the specified directory.
    /// </summary>
    /// <param name="folderPath">The directory path where the file is located.</param>
    /// <param name="fileName">The name of the file to delete.</param>
    public void Delete(string folderPath, string fileName)
    {
        var filePath = Path.Combine(folderPath, fileName);
        if (File.Exists(filePath))
        {
            File.Delete(filePath);
        }
    }
}
