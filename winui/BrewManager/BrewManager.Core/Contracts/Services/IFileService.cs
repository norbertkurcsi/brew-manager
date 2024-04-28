namespace BrewManager.Core.Contracts.Services;

/// <summary>
/// Represents a service for reading, saving, and deleting files.
/// </summary>
public interface IFileService
{
    /// <summary>
    /// Reads content from a file.
    /// </summary>
    /// <typeparam name="T">The type of content to read.</typeparam>
    /// <param name="folderPath">The path to the folder containing the file.</param>
    /// <param name="fileName">The name of the file to read.</param>
    /// <returns>The content read from the file.</returns>
    T Read<T>(string folderPath, string fileName);

    /// <summary>
    /// Saves content to a file.
    /// </summary>
    /// <typeparam name="T">The type of content to save.</typeparam>
    /// <param name="folderPath">The path to the folder where the file will be saved.</param>
    /// <param name="fileName">The name of the file to save.</param>
    /// <param name="content">The content to save to the file.</param>
    void Save<T>(string folderPath, string fileName, T content);

    /// <summary>
    /// Deletes a file.
    /// </summary>
    /// <param name="folderPath">The path to the folder containing the file to delete.</param>
    /// <param name="fileName">The name of the file to delete.</param>
    void Delete(string folderPath, string fileName);
}
