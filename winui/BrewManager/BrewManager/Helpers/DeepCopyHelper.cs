using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Threading.Tasks;

namespace BrewManager.Helpers;

public static class DeepCopyHelper
{
    public static T DeepClone<T>(T obj)
    {
        using MemoryStream memoryStream = new MemoryStream();
        DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(T));
        serializer.WriteObject(memoryStream, obj);
        memoryStream.Position = 0;
        return (T)serializer.ReadObject(memoryStream);
    }
}
