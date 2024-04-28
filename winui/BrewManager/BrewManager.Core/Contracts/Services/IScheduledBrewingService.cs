using BrewManager.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BrewManager.Core.Contracts.Services;

/// <summary>
/// Provides an interface for managing scheduled brewing sessions.
/// This includes operations such as retrieving, posting, deleting, and completing scheduled brewings.
/// </summary>
public interface IScheduledBrewingService
{
    /// <summary>
    /// Retrieves all scheduled brewing sessions asynchronously.
    /// </summary>
    /// <returns>A task that represents the asynchronous operation and contains a list of scheduled brewing sessions.</returns>
    Task<List<ScheduledBrewing>> GetScheduledBrewingsAsync();

    /// <summary>
    /// Schedules a new brewing session asynchronously.
    /// </summary>
    /// <param name="scheduledBrewing">The data transfer object containing the details of the brewing session to be scheduled.</param>
    /// <returns>A task that represents the asynchronous operation.</returns>
    Task PostScheduledBrewingAsync(ScheduledBrewingPostDto scheduledBrewing);

    /// <summary>
    /// Deletes a scheduled brewing session asynchronously.
    /// </summary>
    /// <param name="scheduledBrewing">The scheduled brewing session to be deleted.</param>
    /// <returns>A task that represents the asynchronous operation.</returns>
    Task DeleteScheduledBrewingAsync(ScheduledBrewing scheduledBrewing);

    /// <summary>
    /// Marks a scheduled brewing session as completed asynchronously.
    /// </summary>
    /// <param name="scheduledBrewing">The scheduled brewing session to be marked as complete.</param>
    /// <returns>A task that represents the asynchronous operation.</returns>
    Task CompleteScheduledBrewing(ScheduledBrewing scheduledBrewing);
}
