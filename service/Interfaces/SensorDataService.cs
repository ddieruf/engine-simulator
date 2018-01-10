using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;

namespace EngineSimulator.Services.Interfaces {
	public class SensorDataService {
		private readonly Data.DataContext _context;
		private IServiceProvider _serviceProvider;

		public SensorDataService(Data.DataContext context, IServiceProvider serviceProvider) {
			_context = context;
			_serviceProvider = serviceProvider;
			return;
		}
		public void Add(Models.SensorData item) {
			_context.SensorData.Add(item);
			_context.SaveChanges();
		}
		public IEnumerable<Models.SensorData> List(){
				return _context.SensorData.ToList();
		}
		public IEnumerable<Models.SensorData> ListLastNByVinAndSensor(int startRow, int numRows, string vin){
			var ret = _context.SensorData.Where(q => q.vin.ToLower().Equals(vin.ToLower())).Skip(startRow).Take(numRows);
			return ret;
		}
		public void DeleteAll(){
			_context.Database.ExecuteSqlCommand("delete from SensorData");
		}
		public void Recover()
		{
			using (var scope = _serviceProvider.CreateScope())
			{
				var db = scope.ServiceProvider.GetRequiredService<Data.DataContext>();
				db.Database.Migrate(); // ensure database is created
			}	
		}
	}
}