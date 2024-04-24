using BrewManager.Core.Models;
using Microsoft.UI;
using Microsoft.UI.Xaml.Data;
using Microsoft.UI.Xaml.Media;



namespace BrewManager.Converters;

public class StockThresholdToBrushConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, string language)
    {
        if (value is Ingredient ingredient)
        {
            return ingredient.Stock < ingredient.Threshold ? new SolidColorBrush() { Color = Colors.PaleVioletRed } : new SolidColorBrush() { Color = Colors.Transparent };
        }

        return new SolidColorBrush() { Color = Colors.Transparent };
    }
    public object ConvertBack(object value, Type targetType, object parameter, string language) => throw new NotImplementedException();
}