using System.Text;
using api.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace api.Components
{
    public class SensorDataRepository : ISensorDataRepository
    {
        private readonly SensorsContext db;
        private readonly ILogger logger;
        private readonly List<int>? sensorIds;

        public SensorDataRepository(SensorsContext _context, ILogger _logger)
        {
            logger = _logger;
            db = _context;
            sensorIds = [.. db.Sensors.Select(s => s.Id)];
        }

        /// <summary>
        ///  Получает данные за заданный период времени.
        /// </summary>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <returns></returns>
        public object GetSensorData(DateTime startDate, DateTime endDate) 
        {
            logger.LogInformation($"GetSensorData (с {startDate} по {endDate})");

            var data = db.SensorData
                .Where(x => x.TimeStamp >= startDate && x.TimeStamp <= endDate)
                // .Where(x => sensorIds.Contains(x.SensorId))
                .GroupBy(x => new { x.TimeStamp, x.SensorId })
                .Select(g => new { g.Key.TimeStamp, g.Key.SensorId, Value = g.First().Value })
                .ToList();

            var result = data
                .GroupBy(x => x.TimeStamp)
                .Select(g => new
                {
                    TimeStamp = g.Key,
                    Sensors = sensorIds.Select(sensorId =>
                    {
                        var sensorData = g.FirstOrDefault(x => x.SensorId == sensorId);
                        return new
                        {
                            Id = sensorId,
                            Name = db.Sensors.First(s => s.Id == sensorId).Name,
                            Value = sensorData?.Value ?? -1
                        };
                    }).ToList()
                }).ToList();
            logger.LogInformation("GetSensorData (к-во: {result.Count()})");
            // PPrint(logger, result);
            return result;
        }

        /// <summary>
        ///  Получает агрегированные данные (среднее, максимум, минимум) за указанный период.
        /// </summary>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <returns></returns>
        public object GetSensorSummary(DateTime startDate, DateTime endDate)
        {
            logger.LogInformation($"GetSensorSummary (с {startDate} по {endDate})");
            var result = db.SensorData
                .Where(
                    x => x.TimeStamp >= startDate
                    && x.TimeStamp <= endDate
                )
                .Include(x => x.Sensor)
                .GroupBy(x => x.SensorId)
                .Select(x => new
                {
                    SensorId = x.Key,
                    SensorName = x.FirstOrDefault().Sensor.Name,
                    Min = x.Min(y => y.Value),
                    Max = x.Max(y => y.Value),
                    Avg = x.Average(y => y.Value)
                })
                .ToList();
            logger.LogInformation($"GetSensorSummary (к-во: {result.Count()})");
            // PPrint(logger, result);
            return result;
        }

        private static void PPrint(ILogger logger, IEnumerable<object> list)
        {
            StringBuilder result = new();
            foreach (var row in list)
            {
                result.AppendLine(row.ToString());
            }
            logger.LogInformation(result.ToString());

        }

        /// <summary>
        /// Принимает данные от эмулятора датчиков и сохраняет их в базе.
        /// </summary>
        /// <param name="data"></param> 
        public void SaveSensorData(List<SensorData> data)
        {
            db.SensorData.AddRange(data);
            db.SaveChanges();
        }
    }
}