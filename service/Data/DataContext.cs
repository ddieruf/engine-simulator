using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EngineSimulator.Services.Data {
	public class DataContext : DbContext {
		public DataContext(DbContextOptions<DataContext> options) : base(options) {

		}
		public DbSet<Models.Engine> Engine { get; set; }
		public DbSet<Models.SensorData> SensorData { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder) {
			modelBuilder.Entity<Models.Engine>().ToTable("Engine");
			modelBuilder.Entity<Models.Engine>().HasKey(x => x.id);
			//modelBuilder.Entity<Models.SensorData>().HasIndex(x => new { x.OrdStatus });

			modelBuilder.Entity<Models.SensorData>().ToTable("SensorData");
			modelBuilder.Entity<Models.SensorData>().HasKey(x => x.id);
		}
	}
}