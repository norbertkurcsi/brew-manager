﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BrewManager.Core.Models;
public class IngredientPostDto
{
    public string Name
    {
        get; set;
    }
    public int Stock
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
