using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Steeltoe.Extensions.Configuration;
namespace EngineSimulator.Services
{
    public class Program
    {
        public static void Main(string[] args)
        {
            BuildWebHost(args).Run();
        }

        public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
								.UseEnvironment("Development")//Development|Staging|Production|<ASPNETCORE_ENVIRONMENT envi var>
								.UseSetting("detailedErrors", "true")//the app will display details of startup
								.UseSetting("applicationName", "fortune-teller-services")//the app name reference
								.CaptureStartupErrors(true)//display an error page, if errors happen durning startup
								.ConfigureAppConfiguration(config => config.AddCloudFoundry())
                .UseStartup<Startup>()
                .Build();
    }
}
