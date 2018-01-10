using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;

namespace EngineSimulator.Services.Interfaces {
	public class EngineService {
		private readonly Data.DataContext _context;
		private IServiceProvider _serviceProvider;

		public EngineService(Data.DataContext context, IServiceProvider serviceProvider) {
			_context = context;
			_serviceProvider = serviceProvider;
			return;
		}
		public Models.Engine Add(Models.Engine item) {
			if(!_context.Engine.Any(q => q.vin.ToLower().Equals(item.vin.ToLower()))){
				_context.Engine.Add(item);
				_context.SaveChanges();
			}

			return Get(item.vin);
		}
		public IEnumerable<Models.Engine> List(){
				return _context.Engine.ToList();
		}
		public Models.Engine Get(string vin){
			return _context.Engine.FirstOrDefault(q => q.vin.ToLower().Equals(vin.ToLower()));
		}
		public void Delete(string vin){
			if(!_context.Engine.Any(q => q.vin.ToLower().Equals(vin.ToLower())))
				return;

			var engine = Get(vin);
			_context.Engine.Remove(engine);
			_context.SaveChanges();
		}
		public void DeleteAll(){
			_context.Database.ExecuteSqlCommand("delete from Engine");
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