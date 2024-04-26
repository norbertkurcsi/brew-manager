using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BrewManager.Views;

namespace BrewManager.Contracts.Services;
public interface INewRecipeDialogService
{
    public Stream Image{ get; set; }
    public string Title{ get; set; }

    public void Clear();
    public NewRecipeDialogContent GetDialogContent();
    public Task Save();

}
