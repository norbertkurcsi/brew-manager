using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Data;

namespace BrewManager.Converters;

/// <summary>
/// Converts a user object to Visibility based on the provided parameter.
/// </summary>
public class UserToVisibilityConverter : IValueConverter
{
    /// <summary>
    /// Converts a user object to Visibility based on the provided parameter.
    /// </summary>
    /// <param name="value">The user object to convert.</param>
    /// <param name="targetType">The type of the target property.</param>
    /// <param name="parameter">The parameter specifying whether to hide or show based on the user object.</param>
    /// <param name="language">The language used for conversion.</param>
    /// <returns>Visibility.Visible if the parameter is "logout" and the user is not null; Visibility.Collapsed if the parameter is "logout" and the user is null;
    /// Visibility.Visible if the parameter is "login" and the user is null; Visibility.Collapsed if the parameter is "login" and the user is not null; otherwise, Visibility.Collapsed.</returns>
    public object Convert(object value, Type targetType, object parameter, string language)
    {
        var hide = (string)parameter;
        var user = value;

        if (hide == "logout")
        {
            if (user != null)
            {
                return Visibility.Visible;
            }
            return Visibility.Collapsed;
        }
        else if (hide == "login")
        {
            if (user == null)
            {
                return Visibility.Visible;
            }
            return Visibility.Collapsed;
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
