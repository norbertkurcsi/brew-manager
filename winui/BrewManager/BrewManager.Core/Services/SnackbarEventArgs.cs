using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BrewManager.Core.Services;
public class SnackbarEventArgs : EventArgs
{
    public string Message
    {
        get;
    }

    public bool isSuccess
    {
        get;
    }

    public SnackbarEventArgs(string message, bool isSuccess)
    {
        Message = message;
        this.isSuccess = isSuccess;
    }
}
