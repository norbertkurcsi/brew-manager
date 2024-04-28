using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Data;

namespace BrewManager.Converters;

/// <summary>
/// Converts a boolean value to Visibility by negating it. 
/// True becomes Collapsed, and False becomes Visible.
/// </summary>
public class BoolNegationToVisibilityConverter : IValueConverter
{
    /// <summary>
    /// Converts a boolean value to Visibility by negating it. 
    /// True becomes Collapsed, and False becomes Visible.
    /// </summary>
    /// <param name="value">The boolean value to convert.</param>
    /// <param name="targetType">The type of the target property.</param>
    /// <param name="parameter">An optional parameter to use in the conversion.</param>
    /// <param name="language">The language used for conversion.</param>
    /// <returns>Visibility.Collapsed if the value is true; otherwise, Visibility.Visible.</returns>
    public object Convert(object value, Type targetType, object parameter, string language)
    {
        if (value is bool val)
        {
            return val ? Visibility.Collapsed : Visibility.Visible;
        }
        return Visibility.Collapsed;
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
