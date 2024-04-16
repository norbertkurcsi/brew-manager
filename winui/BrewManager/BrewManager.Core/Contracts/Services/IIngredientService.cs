using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BrewManager.Core.Models;

namespace BrewManager.Core.Contracts.Services;

public interface IIngredientService
{
    public Task<List<Ingredient>> GetInventoryItemsAsync();
}
