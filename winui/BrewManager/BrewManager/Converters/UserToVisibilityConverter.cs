using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BrewManager.Core.Models;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Data;

namespace BrewManager.Converters;

public class UserToVisibilityConverter : IValueConverter
{
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

    public object ConvertBack(object value, Type targetType, object parameter, string language) => throw new NotImplementedException();
}
