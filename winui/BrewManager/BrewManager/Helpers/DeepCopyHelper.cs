using System.Runtime.Serialization.Json;

namespace BrewManager.Helpers;

/// <summary>
/// Provides methods for deep cloning objects.
/// </summary>
public static class DeepCopyHelper
{
    /// <summary>
    /// Deep clones an object using DataContractJsonSerializer.
    /// </summary>
    /// <typeparam name="T">The type of the object to clone.</typeparam>
    /// <param name="obj">The object to clone.</param>
    /// <returns>A deep clone of the provided object.</returns>
    public static T DeepClone<T>(T obj)
    {
        using MemoryStream memoryStream = new MemoryStream();
        DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(T));
        serializer.WriteObject(memoryStream, obj);
        memoryStream.Position = 0;
        return (T)serializer.ReadObject(memoryStream);
    }
}
