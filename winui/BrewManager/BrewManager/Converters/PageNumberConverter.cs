using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Data;

namespace BrewManager.Converters;

public class PageNumberConverter : IMultiValueConverter
{
    public object Convert(object[] values, Type targetType, object parameter, CultureInfo culture)
    {
        if (values.Length != 2 || !(values[0] is int) || !(values[1] is int))
            return "";

        int currentPage = (int)values[0];
        int totalPages = (int)values[1];

        return $"Page {currentPage} of {totalPages}";
    }

    public object[] ConvertBack(object value, Type[] targetTypes, object parameter, CultureInfo culture) => throw new NotImplementedException();
}
