using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace EngineSimulator.Services.Controllers {
	[Route("sensordata")]
	public class SensorDataController : Controller {
		private readonly Interfaces.SensorDataService _sensorDataService;
		private readonly ILogger<SensorDataController> _logger;

		public SensorDataController(Interfaces.SensorDataService sensorDataService, ILogger<SensorDataController> logger) {
			_sensorDataService = sensorDataService;
			_logger = logger;
		}

		[HttpPost]
		public IActionResult Add([FromBody] Models.SensorData sensorData) {
			if ( sensorData == null ) {
				return BadRequest();
			}

			_sensorDataService.Add(sensorData);

			return Ok();
		}
		
		[HttpGet]
		public IActionResult HealthCheck(){
			return Ok();
		}

		[HttpGet("all")]
		public IEnumerable<Models.SensorData> List(){
			return _sensorDataService.List();
		}

		[HttpDelete("alldata")]
		public IActionResult DeleteAll(){
			_sensorDataService.DeleteAll();
			return Ok();
		}

		[HttpGet("listlastn/{vin}/{startRow}/{numRows}")]
		public IEnumerable<Models.SensorData> ListByTime(int startRow, int numRows, string vin){
			return _sensorDataService.ListLastNByVinAndSensor(startRow, numRows, vin);
		}
	}
}