using BrewManager.Core.Models;
using Microsoft.UI;
using Microsoft.UI.Xaml.Data;
using Microsoft.UI.Xaml.Media;
using Windows.UI;

namespace BrewManager.Converters;

/// <summary>
/// Converts stock and threshold values of an ingredient to a SolidColorBrush.
/// If the stock is less than the threshold, returns a SolidColorBrush with a specific color; otherwise, returns a SolidColorBrush with a Transparent color.
/// </summary>
public class StockThresholdToBrushConverter : IValueConverter
{
    /// <summary>
    /// Converts stock and threshold values of an ingredient to a SolidColorBrush.
    /// If the stock is less than the threshold, returns a SolidColorBrush with a specific color; otherwise, returns a SolidColorBrush with a Transparent color.
    /// </summary>
    /// <param name="value">The value to convert.</param>
    /// <param name="targetType">The type of the target property.</param>
    /// <param name="parameter">An optional parameter to use in the conversion.</param>
    /// <param name="language">The language used for conversion.</param>
    /// <returns>A SolidColorBrush with a specific color if the stock is less than the threshold; otherwise, a SolidColorBrush with a Transparent color.</returns>
    public object Convert(object value, Type targetType, object parameter, string language)
    {
        if (value is Ingredient ingredient)
        {
            return ingredient.Stock < ingredient.Threshold ? new SolidColorBrush() { Color = Color.FromArgb(255, 255, 153, 153) } : new SolidColorBrush() { Color = Colors.Transparent };
        }

        return new SolidColorBrush() { Color = Colors.Transparent };
    }

    /// <summary>
    /// This method is not implemented and will always throw NotImplementedException.
    /// </summary>
    /// <param name="value">The value to convert back.</param>
    /// <param name="targetType">The type to convert back to.</param>
    /// <param name="parameter">An optional parameter to use in the conversion.</param>
    /// <param name="language">The language used for conversion.</param>
    /// <returns>It always throws NotImplementedException.</returns>
    public object ConvertBack(object value, Type targetType, object parameter, string language) => throw new NotImplementedException();
}
