using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;


namespace Emulator
{
    public class SensorEmulator
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiUrl;
        private readonly Random _random;
        private readonly ILogger _logger;

        public SensorEmulator(HttpClient httpClient, string apiUrl, ILogger logger)
        {
            _httpClient = httpClient;
            _apiUrl = apiUrl;
            _random = new Random();
            _logger = logger;
        }

        /// <summary>
        /// Генерация данных для датчиков.
        /// </summary>
        private List<SensorData> GenerateSensorData()
        {
            var sensorDataList = new List<SensorData>();
            var timeStamp = DateTime.UtcNow;
            for (int sensorId = 1; sensorId <= 3; sensorId++)
            {
                var data = new SensorData
                {
                    SensorId = sensorId,
                    Value = _random.NextInt64(100), // Случайное значение от 0 до 100
                    Timestamp = timeStamp
                };

                sensorDataList.Add(data);
            }

            return sensorDataList;
        }

        /// <summary>
        /// Отправка данных в API.
        /// </summary>
        private async Task SendDataToApiAsync(List<SensorData> sensorDataList, CancellationToken cancellationToken)
        {
            try
            {
                var response = await _httpClient.PostAsJsonAsync($"{_apiUrl}/api/data", sensorDataList, cancellationToken);

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError($"[API Error] Failed to send data. Status code: {response.StatusCode}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"[API Error] {ex.Message}");
            }
        }

        /// <summary>
        /// Основной цикл эмуляции.
        /// </summary>
        public async Task StartAsync(CancellationToken cancellationToken)
        {
            while (!cancellationToken.IsCancellationRequested)
            {
                try
                {
                    // Генерация данных
                    var sensorDataList = GenerateSensorData();

                    // Отправка данных в API
                    await SendDataToApiAsync(sensorDataList, cancellationToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError($"[Error] {ex.Message}");
                }

                // Ожидание 1 секунды перед следующей отправкой
                await Task.Delay(1000, cancellationToken);
            }
        }
    }
}