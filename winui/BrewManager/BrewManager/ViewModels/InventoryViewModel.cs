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
using BrewManager.Contracts.Services;

namespace BrewManager.ViewModels;

/// <summary>
/// ViewModel for managing inventory items.
/// </summary>
public partial class InventoryViewModel : ObservableRecipient, INavigationAware
{
    private readonly IIngredientService _ingredientService;
    private readonly IStorageService _storageService;
    private readonly ILoginService loginService;
    private readonly IRecipeService recipeService;
    [ObservableProperty]
    private Ingredient? selected;

    [ObservableProperty]
    private bool isLoggedIn = false;

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

    /// <summary>
    /// Collection of sample items for the inventory.
    /// </summary>
    public ObservableCollection<Ingredient> SampleItems { get; private set; } = new ObservableCollection<Ingredient>();

    /// <summary>
    /// Collection of property names to sort the inventory list.
    /// </summary>
    public ObservableCollection<string> SortProperties { get; } = new ObservableCollection<string>();

    /// <summary>
    /// Collection of sort directions for sorting the inventory list.
    /// </summary>
    public ObservableCollection<ListSortDirection> SortDirections { get; } = new ObservableCollection<ListSortDirection>();

    /// <summary>
    /// Collection of page sizes for pagination.
    /// </summary>
    public ObservableCollection<int> PageSizes { get; } = new ObservableCollection<int> { 15, 50, 100 };

    /// <summary>
    /// Collection of error messages for validation.
    /// </summary>
    public ObservableCollection<string> ErrorList = new();

    /// <summary>
    /// Constructor for InventoryViewModel.
    /// Initializes a new instance of the <see cref="InventoryViewModel"/> class.
    /// </summary>
    /// <param name="ingredientService">The ingredient service.</param>
    /// <param name="storageService">The storage service.</param>
    /// <param name="loginService">The login service.</param>
    public InventoryViewModel(IIngredientService ingredientService, IStorageService storageService, ILoginService loginService, IRecipeService recipeService)
    {
        _ingredientService = ingredientService;
        this._storageService = storageService;
        this.loginService = loginService;
        this.recipeService = recipeService;
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

    /// <summary>
    /// Handles the PropertyChanged event to trigger actions based on property changes.
    /// </summary>
    /// <param name="sender">The sender of the event.</param>
    /// <param name="e">The PropertyChangedEventArgs.</param>
    private async void OnPropertyChanged(object sender, PropertyChangedEventArgs e)
    {
        if (e.PropertyName == nameof(SelectedSortProperty) || e.PropertyName == nameof(SelectedSortDirection) || e.PropertyName == nameof(SelectedPageSize))
        {
            if (e.PropertyName == nameof(SelectedPageSize))
            {
                CurrentPageNumber = 1;
            }
            await GetItemsAsync();
            IsFormVisible = Visibility.Collapsed;
        }
        else if (e.PropertyName == nameof(Selected))
        {
            IsFormVisible = Visibility.Visible;
            if (Selected != null)
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
        }
        else if (e.PropertyName == nameof(EditedIngredient.Name) || e.PropertyName == nameof(EditedIngredient.Stock) || e.PropertyName == nameof(EditedIngredient.Threshold))
        {
            SaveItemCommand.NotifyCanExecuteChanged();
        }
    }

    private async void ShowInfoBar(object? sender, SnackbarEventArgs e)
    {
        InfoBarSeverity = e.isSuccess ? InfoBarSeverity.Success : InfoBarSeverity.Error;
        InfoBarMassege = e.Message;
        if (e.isSuccess)
        {
            await GetItemsAsync();
            IsFormVisible = Visibility.Collapsed;

        }
        IsInfoBarOpen = true;
        await Task.Delay(3000);
        IsInfoBarOpen = false;
    }

    /// <summary>
    /// Command to open a file picker to select an image file.
    /// </summary>
    [RelayCommand]
    private async void OpenFile()
    {
        FileOpenPicker fileOpenPicker = new()
        {
            ViewMode = PickerViewMode.Thumbnail,
            FileTypeFilter = { ".jpg", ".png", ".jpeg" },
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

    /// <summary>
    /// Command to add a new item to the inventory.
    /// </summary>
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

    /// <summary>
    /// Command to save the currently edited ingredient.
    /// </summary>
    [RelayCommand(CanExecute = nameof(validateInputs))]
    private void SaveItem()
    {
        if (EditedIngredient == null) return;

        if (string.IsNullOrWhiteSpace(EditedIngredient.Id))
        {
            _ingredientService.CreateIngredientAsync(EditedIngredient);
        }
        else
        {
            _ingredientService.UpdateIngredientAsync(EditedIngredient);
        }
    }

    /// <summary>
    /// Command to delete the selected ingredient.
    /// </summary>
    [RelayCommand]
    private async void DeleteItem()
    {
        if (EditedIngredient == null) return;

        List<string> recipes = await recipeService.GetRecipeNamesThatContainIngredient(EditedIngredient.Id);

        if(recipes.Count != 0)
        {
            var message = "Unable to delete. The following recipes contain this ingredient: " + string.Join(", ", recipes);
            ShowInfoBar(null, new SnackbarEventArgs(message, false));
            return;
        }

        await _ingredientService.DeleteIngredientAsync(EditedIngredient.Id);
    }

    /// <summary>
    /// Method called when navigating to this ViewModel.
    /// </summary>
    /// <param name="parameter">Navigation parameter.</param>
    public async void OnNavigatedTo(object parameter)
    {
        IsLoggedIn = loginService.GetLoggedInUser() != null;
        if (IsLoggedIn)
        {
            await GetItemsAsync();
        }
    }

    /// <summary>
    /// Retrieves the items asynchronously based on the current page size and sort properties.
    /// </summary>
    private async Task GetItemsAsync()
    {
        SampleItems.Clear();

        var data = await _ingredientService.GetInventoryItemsPagedAsync(SelectedPageSize, CurrentPageNumber, SelectedSortProperty, SelectedSortDirection);
        TotalPages = data.Pages;

        foreach (var item in data.Data)
        {
            SampleItems.Add(item);
        }
    }

    /// <summary>
    /// Validates the inputs for saving an ingredient.
    /// </summary>
    /// <returns>True if the inputs are valid; otherwise, false.</returns>
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

    /// <summary>
    /// Command to navigate to the previous page of inventory items.
    /// </summary>
    [RelayCommand]
    private async void PreviousPage()
    {
        if (CurrentPageNumber != 1)
        {
            CurrentPageNumber--;
            await GetItemsAsync();
            IsFormVisible = Visibility.Collapsed;
        }
    }

    /// <summary>
    /// Command to navigate to the next page of inventory items.
    /// </summary>
    [RelayCommand]
    private async void NextPage()
    {
        if (CurrentPageNumber < TotalPages)
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

    /// <summary>
    /// Method called when navigating away from this ViewModel.
    /// </summary>
    public void OnNavigatedFrom()
    {
    }
}
