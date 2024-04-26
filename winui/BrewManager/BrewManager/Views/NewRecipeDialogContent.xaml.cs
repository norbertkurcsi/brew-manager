using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using BrewManager.Contracts.Services;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Controls.Primitives;
using Microsoft.UI.Xaml.Data;
using Microsoft.UI.Xaml.Input;
using Microsoft.UI.Xaml.Media;
using Microsoft.UI.Xaml.Navigation;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.Storage.Pickers;
using Windows.Storage;
using WinRT.Interop;

// To learn more about WinUI, the WinUI project structure,
// and more about our project templates, see: http://aka.ms/winui-project-info.

namespace BrewManager.Views;
/// <summary>
/// An empty page that can be used on its own or navigated to within a Frame.
/// </summary>
public sealed partial class NewRecipeDialogContent : Page, INotifyPropertyChanged
{
    private readonly INewRecipeDialogService dialogService;

    private string name;

    public string Name
    {
        get
        {
            return name;
        }
        set
        {
            name = value;
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(nameof(Name)));
            dialogService.Title = name;
        }
    }

    private string imageName = "<not selected>";

    public string ImageName
    {
        get
        {
            return imageName;
        }
        set
        {
            imageName = value;
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(nameof(ImageName)));
        }
    }

    private Stream image;

    public Stream Image
    {
        get
        {
            return image;
        }
        set
        {
            image = value;
            dialogService.Image = image;
        }
    }


    public NewRecipeDialogContent(INewRecipeDialogService dialogService)
    {
        this.InitializeComponent();
        this.dialogService = dialogService;
    }

    public event PropertyChangedEventHandler? PropertyChanged;

    private async void AddImageClicked(object sender, RoutedEventArgs e)
    {
        FileOpenPicker fileOpenPicker = new()
        {
            ViewMode = PickerViewMode.Thumbnail,
            FileTypeFilter = { ".jpg", ".png"},
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
