using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace EngineSimulator.Services.Controllers {
	[Route("engine")]
	public class EngineController : Controller {
		private readonly Interfaces.EngineService _engineService;
		private readonly ILogger<EngineController> _logger;

		public EngineController(Interfaces.EngineService EngineService, ILogger<EngineController> logger) {
			_engineService = EngineService;
			_logger = logger;
		}

		[HttpPost]
		public IActionResult Add([FromBody] Models.Engine Engine) {
			if ( Engine == null ) {
				return BadRequest();
			}

			_engineService.Add(Engine);

			return Ok();
		}
		
		[HttpGet]
		public IActionResult HealthCheck(){
			return Ok();
		}

		[HttpGet("all")]
		public IEnumerable<Models.Engine> List(){
			return _engineService.List();
		}

		[HttpGet("{vin}")]
		public Models.Engine Get(string vin){
			return _engineService.Get(vin);
		}

		[HttpDelete("{vin}")]
		public IActionResult Delete(string vin){
			_engineService.Delete(vin);
			return Ok();
		}

		[HttpDelete("alldata")]
		public IActionResult DeleteAll(){
			_engineService.DeleteAll();
			return Ok();
		}
	}
}