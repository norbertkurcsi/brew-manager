using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BrewManager.Core.Models;

namespace BrewManager.Core.Contracts.Services;
public interface IScheduledBrewingService
{
    public Task<List<ScheduledBrewing>> GetScheduledBrewingsAsync();
    public Task PostScheduledBrewingAsync(ScheduledBrewingPostDto scheduledBrewing);
    public Task DeleteScheduledBrewingAsync(ScheduledBrewing scheduledBrewing);
    public Task CompleteScheduledBrewing(ScheduledBrewing scheduledBrewing);
    
}
