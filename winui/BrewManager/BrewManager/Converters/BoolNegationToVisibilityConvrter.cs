using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Data;

namespace BrewManager.Converters;

class BoolNegationToVisibilityConvrter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, string language)
    {
        if(value is bool val)
        {
            return val ? Visibility.Collapsed : Visibility.Visible;
        }
        return Visibility.Collapsed;
    }

    public object ConvertBack(object value, Type targetType, object parameter, string language) => throw new NotImplementedException();
}
