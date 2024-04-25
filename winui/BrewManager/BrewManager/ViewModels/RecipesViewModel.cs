using System.Collections.ObjectModel;
using System.Windows.Input;

using BrewManager.Contracts.Services;
using BrewManager.Contracts.ViewModels;
using BrewManager.Core.Contracts.Services;
using BrewManager.Core.Models;

using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace BrewManager.ViewModels;

public partial class RecipesViewModel : ObservableRecipient, INavigationAware
{
    private readonly INavigationService _navigationService;
    private readonly IRecipeService _recipeService;

    public ObservableCollection<Recipe> Source { get; } = new ObservableCollection<Recipe>();

    public RecipesViewModel(INavigationService navigationService, IRecipeService recipeService)
    {
        _navigationService = navigationService;
        _recipeService = recipeService;
    }

    public async void OnNavigatedTo(object parameter)
    {
        Source.Clear();

        var data = await _recipeService.GetRecipesAsync();
        foreach (var item in data)
        {
            Source.Add(item);
        }
    }

    public void OnNavigatedFrom()
    {
    }

    [RelayCommand]
    private void OnItemClick(Recipe? clickedItem)
    {
        if (clickedItem != null)
        {
            _navigationService.SetListDataItemForNextConnectedAnimation(clickedItem);
            _navigationService.NavigateTo(typeof(RecipesDetailViewModel).FullName!, clickedItem);
        }
    }
}
