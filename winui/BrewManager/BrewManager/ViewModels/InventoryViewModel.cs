using System.Collections.ObjectModel;
using System.ComponentModel;
using BrewManager.Contracts.ViewModels;
using BrewManager.Core.Contracts.Services;
using BrewManager.Core.Models;
using BrewManager.Core.Services;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Windows.Storage.Pickers;
using Windows.Storage;
using WinRT.Interop;

namespace BrewManager.ViewModels;

public partial class InventoryViewModel : ObservableRecipient, INavigationAware
{
    private readonly IIngredientService _ingredientService;
    private readonly IStorageService _storageService;
    [ObservableProperty]
    private Ingredient? selected;

    [ObservableProperty]
    private Ingredient? editedIngredient = null;

    [ObservableProperty]
    private string infoBarMassege = "";

    [ObservableProperty]
    private InfoBarSeverity infoBarSeverity;

    [ObservableProperty]
    private bool isInfoBarOpen = false;

    [ObservableProperty]
    private Visibility isFormVisible = Visibility.Collapsed;

    [ObservableProperty]
    private bool isEdit = false;
    [ObservableProperty]
    private bool isAdd = false;

    public ObservableCollection<Ingredient> SampleItems { get; private set; } = new ObservableCollection<Ingredient>();

    public ObservableCollection<string> SortProperties { get; } = new ObservableCollection<string>();
    public ObservableCollection<ListSortDirection> SortDirections { get; } = new ObservableCollection<ListSortDirection>();
    public ObservableCollection<int> PageSizes { get; } = new ObservableCollection<int> { 15, 50, 100 };
    public ObservableCollection<string> ErrorList = new();


    public InventoryViewModel(IIngredientService ingredientService, IStorageService storageService)
    {
        _ingredientService = ingredientService;
        this._storageService = storageService;
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
        _ingredientService.RequestResult += ShowInfoBar;
    }

    private async void ShowInfoBar(object? sender, SnackbarEventArgs e)
    {
        InfoBarSeverity = e.isSuccess ? InfoBarSeverity.Success : InfoBarSeverity.Error;
        InfoBarMassege = e.Message;
        if(e.isSuccess)
        {
            await GetItemsAsync();
            IsFormVisible = Visibility.Collapsed;
            
        }
        IsInfoBarOpen = true;
        await Task.Delay(3000);
        IsInfoBarOpen = false;
    }

    [RelayCommand]
    private async void OpenFile()
    {
        FileOpenPicker fileOpenPicker = new()
        {
            ViewMode = PickerViewMode.Thumbnail,
            FileTypeFilter = { ".jpg", ".jpeg", ".png" },
        };

        var windowHandle = WindowNative.GetWindowHandle(App.MainWindow);
        InitializeWithWindow.Initialize(fileOpenPicker, windowHandle);

        StorageFile file = await fileOpenPicker.PickSingleFileAsync();

        if (file != null && EditedIngredient != null)
        {
            var url = await _storageService.UploadIngredientImageAsync($"{Guid.NewGuid()}.jpg", await file.OpenStreamForReadAsync());
            EditedIngredient.ImageUrl = url.ToString();
        }
    }

    [RelayCommand]
    private void AddNewItem()
    {
        Selected = null;
        IsFormVisible = Visibility.Visible;
        IsEdit = false;
        IsAdd = true;
        EditedIngredient = new Ingredient()
        {
            Id = null,
            Name = string.Empty,
            Threshold = 1,
            Stock = 0,
            ImageUrl = "https://brewmanager.blob.core.windows.net/ingredients/anonym.jpeg"
        };
        editedIngredient.PropertyChanged += OnPropertyChanged;
    }

    [RelayCommand(CanExecute = nameof(validateInputs))]
    private void SaveItem()
    {
        if (EditedIngredient == null) return;

        if(string.IsNullOrWhiteSpace(EditedIngredient.Id))
        {
            _ingredientService.CreateIngredientAsync(EditedIngredient);
        } 
        else
        {
            _ingredientService.UpdateIngredientAsync(EditedIngredient);
        }
    }

    [RelayCommand]
    private void DeleteItem()
    {
        if(EditedIngredient == null) return;

        _ingredientService.DeleteIngredientAsync(EditedIngredient.Id);
    }


    public async void OnNavigatedTo(object parameter)
    {
        await GetItemsAsync();
    }

    private async Task GetItemsAsync ()
    {
        SampleItems.Clear();

        var data = await _ingredientService.GetInventoryItemsPagedAsync(SelectedPageSize, CurrentPageNumber, SelectedSortProperty, SelectedSortDirection);
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
            IsFormVisible = Visibility.Collapsed;
        } else if(e.PropertyName == nameof(Selected))
        {
            IsFormVisible = Visibility.Visible;
            if(Selected != null)
            {
                EditedIngredient = new Ingredient
                {
                    Id = Selected.Id,
                    Name = Selected.Name,
                    Stock = Selected.Stock,
                    Threshold = Selected.Threshold,
                    ImageUrl = Selected.ImageUrl
                };
                editedIngredient.PropertyChanged += OnPropertyChanged;
            }
            IsEdit = true;
            IsAdd = false;
            SaveItemCommand.NotifyCanExecuteChanged();
        } else if(e.PropertyName == nameof(EditedIngredient.Name) || e.PropertyName == nameof(EditedIngredient.Stock) || e.PropertyName == nameof(EditedIngredient.Threshold))
        {
            SaveItemCommand.NotifyCanExecuteChanged();
        }
    }

    private bool validateInputs()
    {
        if (EditedIngredient == null)
        {
            return false;
        }

        var isValid = true;
        ErrorList.Clear();

        if (string.IsNullOrEmpty(EditedIngredient.Name) || EditedIngredient.Name.Length < 4)
        {
            isValid = false;
            ErrorList.Add("Name of the recipe must be at least 4 characters long");
        }

        if (double.IsNaN(EditedIngredient.Stock) || EditedIngredient.Stock < 0)
        {
            isValid = false;
            ErrorList.Add("Stock must be a positive decimal number");
        }

        if (double.IsNaN(EditedIngredient.Threshold) || EditedIngredient.Threshold < 1)
        {
            isValid = false;
            ErrorList.Add("Threshold must be greater than 0");
        }

        return isValid;
    }


    [RelayCommand]
    private async void PreviousPage()
    {
        if(CurrentPageNumber != 1)
        {
            CurrentPageNumber--;
            await GetItemsAsync();
            IsFormVisible = Visibility.Collapsed;
        }
    }

    [RelayCommand]
    private async void NextPage()
    {
        if(CurrentPageNumber < TotalPages)
        {
            CurrentPageNumber++;
            await GetItemsAsync();
            IsFormVisible = Visibility.Collapsed;
        }
    }

    [ObservableProperty]
    public string selectedSortProperty = "<none>";

    [ObservableProperty]
    public ListSortDirection selectedSortDirection;

    [ObservableProperty]
    public int selectedPageSize = 15;

    [ObservableProperty]
    public int currentPageNumber = 1;

    [ObservableProperty]
    public int totalPages;

    public void OnNavigatedFrom()
    {
    }
}
