using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BrewManager.Core.Services;
public class Secrets
{
    public static string BaseUrl => "http://localhost:3000";

    public static string StorageConnectionString => "DefaultEndpointsProtocol=https;AccountName=brewmanager;AccountKey=dm1GhQCQjnOHhNQWOtHL0lIvK3FH4d6Z35HiF38D2q5m7Xjub2LHFZNGxMaDzaxs9rGFc0FjKOSf+ASt1z0lgg==;EndpointSuffix=core.windows.net";
}
