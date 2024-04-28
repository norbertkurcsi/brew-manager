namespace BrewManager.Core.Services;

/// <summary>
/// Provides data for events that involve displaying a snackbar message.
/// </summary>
public class SnackbarEventArgs : EventArgs
{
    /// <summary>
    /// Gets the message to be displayed in the snackbar.
    /// </summary>
    public string Message
    {
        get;
    }

    /// <summary>
    /// Gets a value indicating whether the operation associated with the snackbar message was successful.
    /// </summary>
    public bool isSuccess
    {
        get;
    }

    /// <summary>
    /// Initializes a new instance of the <see cref="SnackbarEventArgs"/> class with the specified message and success indicator.
    /// </summary>
    /// <param name="message">The message to be displayed.</param>
    /// <param name="isSuccess">A value indicating whether the operation was successful.</param>
    public SnackbarEventArgs(string message, bool isSuccess)
    {
        Message = message;
        this.isSuccess = isSuccess;
    }
}
