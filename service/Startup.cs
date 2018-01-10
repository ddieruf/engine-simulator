using System.Collections.Generic;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

using Steeltoe.Extensions.Configuration;
using Steeltoe.CloudFoundry.Connector.MySql.EFCore;

namespace EngineSimulator.Services
{
    public class Startup
    {
        public Startup(IConfiguration configuration, IHostingEnvironment env)
        {
            //Configuration = configuration;
            var builder = new ConfigurationBuilder()
				.SetBasePath(env.ContentRootPath)
				.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
		        .AddCloudFoundry()
				.AddEnvironmentVariables();

            Configuration = builder.Build();
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddOptions();
            //services.AddDbContext<Data.SensorDataContext>(opt => opt.UseInMemoryDatabase("SensorData"));
            services.AddDbContext<Data.DataContext>(opt => opt.UseMySql(Configuration), ServiceLifetime.Singleton);
            services.AddMvc();
            services.AddCors();
			services.AddSingleton<Interfaces.SensorDataService>();
			services.AddSingleton<Interfaces.EngineService>();
        }
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            app.UseCors(builder => {builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();});
            app.UseMvc();
            app.UseDataSensorService();
            app.UseEngineService();
        }
    }
    public static class SensorDataServiceRegistration
    {
        public static void UseDataSensorService(this IApplicationBuilder app)
        {
            var svc = app.ApplicationServices.GetService<Interfaces.SensorDataService>();
            svc.Recover();
        }
    }
    public static class EngineServiceRegistration
    {
        public static void UseEngineService(this IApplicationBuilder app)
        {
            var svc = app.ApplicationServices.GetService<Interfaces.EngineService>();
            svc.Recover();
        }
    }
}
