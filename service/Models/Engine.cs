using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EngineSimulator.Services.Models {
	public class Engine {
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public long id { get; set; }
		[Required]
		public string vin { get; set; }
		[Required]
		public string sensors{get;set;}
	}
}