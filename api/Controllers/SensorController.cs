using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using api.Components;
using api.Model;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace api.Controllers
{

    [ApiController]
    [Route("api/")]
    public class SensorController(ISensorDataRepository repository, ILogger logger) : ControllerBase
    {
        private readonly ISensorDataRepository _repository = repository;
        private readonly ILogger _logger = logger;

        [HttpPost("data")]
        public IActionResult PostData([FromBody] List<SensorData> data)
        {
            _logger.LogInformation ("Получены данные датчиков.");
            if (data == null || data.Count == 0){
                _logger.LogError("Получены пустые данные датчиков.");
                return BadRequest("Данные не предоставлены.");
            }

            try
            {
                _repository.SaveSensorData(data);
                _logger.LogInformation("Данные датчиков успешно сохранены.");
                return Ok("Данные успешно сохранены.");
            }
            catch (Exception ex)
            {
                _logger.LogError("Ошибка при сохранении данных датчиков: {Error}", ex.Message);
                return StatusCode(500, "Внутренняя ошибка сервера.");
            }
        }

        [HttpGet("data")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<SensorData>))]
        public IActionResult GetData([FromQuery] DateTime start, [FromQuery] DateTime end)
        {
            try
            {
                var data = _repository.GetSensorData(start, end);
                JsonSerializerOptions options = new()
                {
                    WriteIndented = true,
                    ReferenceHandler = ReferenceHandler.IgnoreCycles
                };
                return new JsonResult(data, options);
            }
            catch (Exception ex)
            {
                _logger.LogError("Ошибка при получении данных: {Error}", ex.Message);
                return StatusCode(500, "Внутренняя ошибка сервера.");
            }
        }

        [HttpGet("sensors/summary")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<object>))]
        public IActionResult GetSummary([FromQuery] DateTime start, [FromQuery] DateTime end)
        {
            try
            {
                var summary = _repository.GetSensorSummary(start, end);
                JsonSerializerOptions options = new()
                {
                    WriteIndented = true,
                    ReferenceHandler = ReferenceHandler.IgnoreCycles
                };
                return new JsonResult(summary, options);                
            }
            catch (Exception ex)
            {
                _logger.LogError("Ошибка при получении сводных данных: {Error}", ex.Message);
                return StatusCode(500, "Внутренняя ошибка сервера.");
            }
        }

    }


}
