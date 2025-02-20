using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using api.Components;
using api.Model;

namespace api.Controllers
{

    [ApiController]
    public class XmlController(ILogger logger, IXmlValidator XMLValidator) : ControllerBase
    {
        private readonly ILogger _logger = logger;
        private readonly IXmlValidator _XmlValidator = XMLValidator;

        /// <summary>
        /// Загрузка и валидация XML файла
        /// </summary>
        /// <param name="file">XML файл для загрузки</param>
        /// <returns>Результат загрузки и валидации XML файла</returns>
        [HttpPost("/api/upload-xml")]
        [SwaggerOperation(summary: "Загрузка XML файла", description: "Метод для загрузки и валидации XML файла.")]
        [SwaggerResponse(200, "XML успешно загружен и сохранен.")]
        [SwaggerResponse(400, "Файл не предоставлен или XML не прошел валидацию.")]
        [SwaggerResponse(500, "Внутренняя ошибка сервера.")]
        public async Task<IActionResult> UploadXml(IFormFile file)
        {
            _logger.LogInformation("Обращение по пути /api/upload-xml");
            _logger.LogInformation("Получен файл: {FileName}", file.FileName);
            
            if (file == null || file.Length == 0)
                return BadRequest("Файл не предоставлен.");

            try
            {
                using var reader = new StreamReader(file.OpenReadStream());
                var content = await reader.ReadToEndAsync();

                if (_XmlValidator.ValidateXML(content))
                {
                    bool saveResult = await _XmlValidator.SaveXmlData(new XmlData
                    {
                        Xml = content,
                        TimeStamp = DateTime.Now.ToUniversalTime()
                    });

                    if (saveResult)
                    {
                        _logger.LogInformation("XML успешно загружен и сохранен.");
                        return Ok("XML успешно загружен и сохранен.");

                    }
                    else
                    {
                        _logger.LogError("Ошибка при сохранении данных XML.");
                        return StatusCode(500, "Ошибка при сохранении данных XML.");
                    }
                }
                _logger.LogError("Ошибка при валидации XML.");
                return BadRequest("XML не прошел валидацию.");

            }
            catch (Exception ex)
            {
                _logger.LogError("Ошибка при обработке XML: {Error}", ex.Message);
                return StatusCode(500, "Внутренняя ошибка сервера.");
            }
        }
    }
}

