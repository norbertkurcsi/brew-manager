namespace BrewManager.Core.Models;

/// <summary>
/// Represents a brewing session scheduled in the system with a specific recipe and date.
/// </summary>
public class ScheduledBrewing
{
    /// <summary>
    /// Unique identifier for the scheduled brewing.
    /// </summary>
    public string Id
    {
        get; set;
    }

    /// <summary>
    /// The recipe that is scheduled to be brewed.
    /// </summary>
    public Recipe Recipe
    {
        get; set;
    }

    /// <summary>
    /// The date on which the brewing is scheduled to take place.
    /// </summary>
    public DateTime Date
    {
        get; set;
    }
}

/// <summary>
/// Data transfer object for a scheduled brewing, used for passing data between layers.
/// </summary>
public class ScheduledBrewingDto
{
    /// <summary>
    /// Unique identifier for the scheduled brewing.
    /// </summary>
    public string Id
    {
        get; set;
    }

    /// <summary>
    /// Identifier for the recipe that is scheduled to be brewed.
    /// </summary>
    public string Recipe
    {
        get; set;
    }

    /// <summary>
    /// The date on which the brewing is scheduled to take place.
    /// </summary>
    public DateTime Date
    {
        get; set;
    }
}

/// <summary>
/// Data transfer object for posting a new scheduled brewing. Contains minimal information required for creating a scheduled brewing session.
/// </summary>
public class ScheduledBrewingPostDto
{
    /// <summary>
    /// Identifier for the recipe to be used in the scheduled brewing.
    /// </summary>
    public string Recipe
    {
        get; set;
    }

    /// <summary>
    /// The date and time at which the brewing is scheduled to take place.
    /// </summary>
    public DateTimeOffset Date
    {
        get; set;
    }
}
