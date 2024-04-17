using System;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Windows.Input;
using BrewManager.Contracts.ViewModels;
using BrewManager.Core.Contracts.Services;
using BrewManager.Core.Models;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace BrewManager.ViewModels;

public partial class InventoryViewModel : ObservableRecipient, INavigationAware
{
    private readonly IIngredientService _ingredientService;

    [ObservableProperty]
    private Ingredient? selected;

    public ObservableCollection<Ingredient> SampleItems { get; private set; } = new ObservableCollection<Ingredient>();

    public ObservableCollection<string> SortProperties { get; } = new ObservableCollection<string>();
    public ObservableCollection<ListSortDirection> SortDirections { get; } = new ObservableCollection<ListSortDirection>();
    public ObservableCollection<int> PageSizes { get; } = new ObservableCollection<int> { 5, 10, 15 };



    public InventoryViewModel(IIngredientService ingredientService)
    {
        _ingredientService = ingredientService;

        var ingredientType = typeof(Ingredient);
        var properties = ingredientType.GetProperties();
        SortProperties.Add("<none>");
        foreach (var property in properties)
        {
            SortProperties.Add(property.Name);
        }

        SortDirections.Add(ListSortDirection.Ascending);
        SortDirections.Add(ListSortDirection.Descending);
        PropertyChanged += OnPropertyChanged;
    }


    

    public async void OnNavigatedTo(object parameter)
    {
        await GetItemsAsync();
    }

    private async Task GetItemsAsync ()
    {
        SampleItems.Clear();

        var data = await _ingredientService.GetInventoryItemsAsync(SelectedPageSize, CurrentPageNumber, SelectedSortProperty, SelectedSortDirection);
        TotalPages = data.Pages;

        foreach (var item in data.Data)
        {
            SampleItems.Add(item);
        }
    }

    

    public void EnsureItemSelected()
    {
        //Selected ??= SampleItems.First();
    }

    private async void OnPropertyChanged(object sender, PropertyChangedEventArgs e)
    {
        if (e.PropertyName == nameof(SelectedSortProperty) || e.PropertyName == nameof(SelectedSortDirection) || e.PropertyName == nameof(SelectedPageSize))
        {
            if(e.PropertyName == nameof(SelectedPageSize))
            {
                CurrentPageNumber = 1;
            }
            await GetItemsAsync();
        }
    }


    [RelayCommand]
    private async void PreviousPage()
    {
        if(CurrentPageNumber != 1)
        {
            CurrentPageNumber--;
            await GetItemsAsync();
        }
    }

    [RelayCommand]
    private async void NextPage()
    {
        if(CurrentPageNumber < TotalPages)
        {
            CurrentPageNumber++;
            await GetItemsAsync();
        }
    }

    [ObservableProperty]
    public string selectedSortProperty = "<none>";

    [ObservableProperty]
    public ListSortDirection selectedSortDirection;

    [ObservableProperty]
    public int selectedPageSize = 5;

    [ObservableProperty]
    public int currentPageNumber = 1;

    [ObservableProperty]
    public int totalPages;

    public void OnNavigatedFrom()
    {
    }
}
