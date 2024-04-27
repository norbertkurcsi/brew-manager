﻿using System.Collections.ObjectModel;
using System.Windows.Input;

using BrewManager.Contracts.Services;
using BrewManager.Contracts.ViewModels;
using BrewManager.Core.Contracts.Services;
using BrewManager.Core.Models;
using BrewManager.Core.Services;
using BrewManager.Views;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;

namespace BrewManager.ViewModels;

public partial class RecipesViewModel : ObservableRecipient, INavigationAware
{
    private readonly INavigationService _navigationService;
    private readonly IRecipeService _recipeService;
    private readonly INewRecipeDialogService newRecipeDialogService;
    private readonly ILoginService loginService;
    [ObservableProperty]
    private bool isLoggedIn = false;

    public ObservableCollection<Recipe> Source { get; } = new ObservableCollection<Recipe>();
    public IXamlRoot XamlRoot
    {
        get;
        internal set;
    }

    public RecipesViewModel(
        INavigationService navigationService, 
        IRecipeService recipeService, 
        INewRecipeDialogService newRecipeDialogService,
        ILoginService loginService)
    {
        _navigationService = navigationService;
        _recipeService = recipeService;
        this.newRecipeDialogService = newRecipeDialogService;
        this.loginService = loginService;
    }

    public void OnNavigatedTo(object parameter)
    {
        IsLoggedIn = loginService.GetLoggedInUser() != null;
        if(IsLoggedIn)
        {
            refreshRecipes();
        }
    }

    private async void refreshRecipes()
    {
        Source.Clear();

        var data = await _recipeService.GetRecipesAsync();
        foreach (var item in data)
        {
            Source.Add(item);
        }
    }

    [RelayCommand]
    private async void AddButtonClicked()
    {
        ContentDialog dialog = new ContentDialog();

        dialog.XamlRoot = XamlRoot.GetXamlRoot();
        dialog.Title = "Add new recipe";
        dialog.PrimaryButtonText = "Save";
        dialog.CloseButtonText = "Cancel";
        dialog.DefaultButton = ContentDialogButton.Primary;
        dialog.Content = newRecipeDialogService.GetDialogContent();

        var result = await dialog.ShowAsync();
        if(result == ContentDialogResult.Primary)
        {
            await newRecipeDialogService.Save();
            refreshRecipes();
        }
        newRecipeDialogService.Clear();
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

    [RelayCommand]
    private async void DeleteRecipe(Recipe recipe)
    {
        await _recipeService.DeleteRecipeAsync(recipe.Id);
        refreshRecipes();
    }
}
