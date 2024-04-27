using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BrewManager.Core.Models;


public class ScheduledBrewing
{
    public string Id
    {
        get; set;
    }
    public Recipe Recipe
    {
        get; set;
    }
    public DateTime Date
    {
        get; set;
    }
}

public class ScheduledBrewingDto
{
    public string Id
    {
        get; set;
    }
    public string Recipe
    {
        get; set;
    }
    public DateTime Date
    {
        get; set;
    }
}

public class ScheduledBrewingPostDto
{
    public string Recipe
    {
        get; set;
    }
    public DateTimeOffset Date
    {
        get; set;
    }
}

