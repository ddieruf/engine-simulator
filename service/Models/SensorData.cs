using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EngineSimulator.Services.Models {
	public class SensorData {
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public long id { get; set; }
		[Required]
		public long timestamp { get; set; }
		[Required]
		[MaxLength(100)]
		public string sensorname { get; set; }
		[Required]
		public string datavalue { get; set; }
		[Required]
		[MaxLength(100)]
		public string vin { get; set; }
	}
}