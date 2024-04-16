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

namespace BrewManager.ViewModels
{
    public partial class InventoryViewModel : ObservableRecipient, INavigationAware
    {
        private readonly IIngredientService _ingredientService;

        [ObservableProperty]
        private Ingredient? selected;
        private List<Ingredient> _originalOrder = new List<Ingredient>();

        public ObservableCollection<Ingredient> SampleItems { get; private set; } = new ObservableCollection<Ingredient>();

        public ObservableCollection<string> SortProperties { get; } = new ObservableCollection<string>();
        public ObservableCollection<ListSortDirection> SortDirections { get; } = new ObservableCollection<ListSortDirection>();


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
            SampleItems.Clear();

            _originalOrder = await _ingredientService.GetInventoryItemsAsync();

            foreach (var item in _originalOrder)
            {
                SampleItems.Add(item);
            }
        }

        public void OnNavigatedFrom()
        {
        }

        public void EnsureItemSelected()
        {
            //Selected ??= SampleItems.First();
        }

        private void OnPropertyChanged(object sender, PropertyChangedEventArgs e)
        {
            if (e.PropertyName == nameof(SelectedSortProperty) || e.PropertyName == nameof(SelectedSortDirection))
            {
                SortChanged();
            }
        }

        [RelayCommand]
        private void SortChanged()
        {
            if (SelectedSortProperty != "<none>")
            {
                var property = typeof(Ingredient).GetProperty(SelectedSortProperty);
                if (property != null)
                {
                    if (SelectedSortDirection == ListSortDirection.Ascending)
                    {
                        var sortedItems = SampleItems.OrderBy(x => property.GetValue(x)).ToList();
                        SampleItems.Clear();
                        foreach (var item in sortedItems)
                        {
                            SampleItems.Add(item);
                        }
                    }
                    else
                    {
                        var sortedItems = SampleItems.OrderByDescending(x => property.GetValue(x)).ToList();
                        SampleItems.Clear();
                        foreach (var item in sortedItems)
                        {
                            SampleItems.Add(item);
                        }
                    }
                }
            }
            else
            {
                SampleItems.Clear();
                foreach(var item in _originalOrder) 
                {
                    SampleItems.Add(item);
                }
            }
        }

        [ObservableProperty]
        public string selectedSortProperty = "<none>";

        [ObservableProperty]
        public ListSortDirection selectedSortDirection;
    }
}
