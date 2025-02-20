using System.Text;
using api.Model;
using Microsoft.EntityFrameworkCore;


namespace api.Components
{
    public class SensorDataRepository(SensorsContext context, ILogger logger) : ISensorDataRepository
    {
        private readonly SensorsContext db = context;

        /// <summary>
        ///  Получает данные за заданный период времени.
        /// </summary>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <returns></returns>
        public object GetSensorData(DateTime startDate, DateTime endDate)
        {
            logger.LogInformation($"GetSensorData (с {startDate} по {endDate})");

            var result = db.SensorData
                .Where(
                    x => x.TimeStamp >= startDate
                    && x.TimeStamp <= endDate
                )
                .GroupBy(x => x.TimeStamp) // Сгруппировать по метке времени
                .Select(g => new
                {
                    TimeStamp = g.Key, // Метка времени после группировки
                    Sensors = db.Sensors.Select(sensor => new
                    {
                        Id = sensor.Id,
                        Name = sensor.Name,
                        Value = g.FirstOrDefault(sd => sd.SensorId == sensor.Id) == null // Получить значение для этого датчика в эту метку времени
                            ? -1 // Значение сенсора, если оно отсутвует в базе (что невероятно, но все же!)
                            : g.FirstOrDefault(sd => sd.SensorId == sensor.Id).Value

                    }).ToList()
                })
                .ToList();

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