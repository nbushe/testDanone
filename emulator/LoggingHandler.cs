using System;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace Emulator
{
    public class LoggingHandler : DelegatingHandler
    {
        private readonly ILogger _logger;

        public LoggingHandler(ILogger logger)
        {
            _logger = logger;
        }

        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            // Логирование запроса
            _logger.LogInformation("[HTTP Request]");
            _logger.LogInformation($"Method: {request.Method}");
            _logger.LogInformation($"Request URI: {request.RequestUri}");

            foreach (var header in request.Headers)
            {
                _logger.LogInformation($"  Header: {header.Key} = {string.Join(", ", header.Value)}");
            }

            if (request.Content != null)
            {
                var requestBody = await request.Content.ReadAsStringAsync();
                _logger.LogInformation($"Body:\n{FormatJson(requestBody)}");
            }

            // Выполнение запроса
            var response = await base.SendAsync(request, cancellationToken);

            // Логирование ответа
            _logger.LogInformation("[HTTP Response]");
            _logger.LogInformation($"Status Code: {response.StatusCode}");

            foreach (var header in response.Headers)
            {
                _logger.LogInformation($"  Header: {header.Key} = {string.Join(", ", header.Value)}");
            }

            if (response.Content != null)
            {
                var responseBody = await response.Content.ReadAsStringAsync();
                _logger.LogInformation($"Body:\n{FormatJson(responseBody)}");
            }

            return response;
        }

        private string FormatJson(string json)
        {
            try
            {
                var parsedJson = System.Text.Json.JsonDocument.Parse(json);
                return System.Text.Json.JsonSerializer.Serialize(parsedJson, new System.Text.Json.JsonSerializerOptions { WriteIndented = true });
            }
            catch
            {
                return json; // Если JSON невалидный, возвращаем как есть
            }
        }
    }
}