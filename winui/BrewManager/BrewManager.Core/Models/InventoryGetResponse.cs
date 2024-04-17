using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BrewManager.Core.Models;
public class InventoryGetResponse
{
    public int Pages
    {
        get;
        set;
    }

    public List<Ingredient> Data
    {
        get;
        set;
    }
}