using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BrewManager.Core.Models;


public class Ingredient
{
    public string Id{
       get; set;
    }
    public string Name
    {
        get; set;
    }
    public double Stock
    {
        get; set;
    }
    public int Threshold
    {
        get; set;
    }
    public string ImageUrl
    {
        get;
        set;
    }
}

