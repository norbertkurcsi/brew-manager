using System.ComponentModel;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Windows.Storage.Pickers;
using Windows.Storage;
using WinRT.Interop;
using BrewManager.Contracts.Services;

namespace BrewManager.Views;

/// <summary>
/// A dialog content page used for creating a new recipe. It allows users to input recipe details and select an image.
/// </summary>
public sealed partial class NewRecipeDialogContent : Page, INotifyPropertyChanged
{
    private readonly INewRecipeDialogService dialogService;

    private string name;

    /// <summary>
    /// Gets or sets the name of the recipe. Setting the name will notify property changed and update the dialog service.
    /// </summary>
    public string Name
    {
        get => name;
        set
        {
            if (name != value)
            {
                name = value;
                PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(nameof(Name)));
                dialogService.Title = name;
            }
        }
    }

    private string imageName = "<not selected>";

    /// <summary>
    /// Gets or sets the display name of the image associated with the recipe.
    /// This only updates the UI and does not load the image itself.
    /// </summary>
    public string ImageName
    {
        get => imageName;
        set
        {
            if (imageName != value)
            {
                imageName = value;
                PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(nameof(ImageName)));
            }
        }
    }

    private Stream image;

    /// <summary>
    /// Gets or sets the image stream for the recipe.
    /// Setting the image will also update the image property in the dialog service.
    /// </summary>
    public Stream Image
    {
        get => image;
        set
        {
            if (image != value)
            {
                image = value;
                dialogService.Image = image;
            }
        }
    }

    /// <summary>
    /// Constructor that initializes the NewRecipeDialogContent.
    /// </summary>
    /// <param name="dialogService">The service used to manage new recipe dialog interactions.</param>
    public NewRecipeDialogContent(INewRecipeDialogService dialogService)
    {
        this.InitializeComponent();
        this.dialogService = dialogService;
    }

    /// <summary>
    /// Event triggered when a property changes. Implements INotifyPropertyChanged.
    /// </summary>
    public event PropertyChangedEventHandler? PropertyChanged;

    /// <summary>
    /// Event handler for clicking the add image button. Opens a FileOpenPicker to select an image and updates the image properties.
    /// </summary>
    /// <param name="sender">The sender of the event.</param>
    /// <param name="e">Event data.</param>
    private async void AddImageClicked(object sender, RoutedEventArgs e)
    {
        FileOpenPicker fileOpenPicker = new()
        {
            ViewMode = PickerViewMode.Thumbnail,
            FileTypeFilter = { ".jpg", ".png", ".jpeg" },
        };

        var windowHandle = WindowNative.GetWindowHandle(App.MainWindow);
        InitializeWithWindow.Initialize(fileOpenPicker, windowHandle);

        StorageFile file = await fileOpenPicker.PickSingleFileAsync();

        if (file != null)
        {
            ImageName = file.Name;
            Image = await file.OpenStreamForReadAsync();
        }
    }
}
