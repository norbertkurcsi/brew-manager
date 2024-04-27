using CommunityToolkit.Mvvm.ComponentModel;

namespace BrewManager.Core.Models;


public partial class Ingredient : ObservableObject
{
    [ObservableProperty]
    public string id;

    [ObservableProperty]
    public string name;

    [ObservableProperty]
    public int stock;

    [ObservableProperty]
    public int threshold;

    [ObservableProperty]
    public string imageUrl;

}

