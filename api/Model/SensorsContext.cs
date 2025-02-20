
using System.Data.Common;
using Microsoft.EntityFrameworkCore;

namespace api.Model
{

    /// <summary>
    /// Контекст данных для работы с сенсорами
    /// </summary>
    public class SensorsContext : DbContext
    {
        // Создаем ILoggerFactory
        private static readonly ILoggerFactory loggerFactory = LoggerFactory.Create(builder =>
        {
            builder.AddConsole();
        });
        // Создаем ILogger
        private readonly ILogger log = loggerFactory.CreateLogger<SensorsContext>();
        /// <summary>
        /// Конструктор SensorsContext
        /// </summary>
        /// <param name="options">Параметры конфигурации контекста данных</param>
        public SensorsContext(DbContextOptions<SensorsContext> options) : base(options)
        {
            // Database.EnsureDeleted();

            try
            {
                Database.EnsureCreated();
            }
            catch (System.Exception e)
            {
                log.LogCritical("Ошибка соединения с базой данных", e);
                throw ;
                
            }
        }

        /// <summary>
        /// Коллекция сенсоров
        /// </summary>
        public DbSet<Sensor> Sensors { get; set; }

        /// <summary>
        /// Коллекция данных сенсоров
        /// </summary>
        public DbSet<SensorData> SensorData { get; set; }

        /// <summary>
        /// Коллекция XML данных
        /// </summary>
        public DbSet<XmlData> XmlData { get; set; }

        /// <summary>
        /// Конфигурация подключения к базе данных
        /// </summary>
        /// <param name="optionsBuilder">Билдер параметров конфигурации</param>
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            optionsBuilder.UseNpgsql(configuration.GetConnectionString("DefaultConnection"));

        }

        /// <summary>
        /// Конфигурация моделей данных
        /// </summary>
        /// <param name="modelBuilder">Билдер моделей</param>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Сидируем
            try
            {
                log.LogInformation("Сидируем датчики");
                modelBuilder.Entity<Sensor>().HasData(
                    new Sensor { Id = 1, Name = "Sensor1" },
                    new Sensor { Id = 2, Name = "Sensor2" },
                    new Sensor { Id = 3, Name = "Sensor3" }
                );
                log.LogInformation("Успешно");
            }
            catch (System.Exception e)
            {
                log.LogInformation("Не удалось сидировать датчики ", e.Message);
            }

            // // И SensorData (value от 0 до 100)
            // try
            // {
            //     log.LogInformation("Сидируем данные сенсоров");
            //     var t1 = DateTime.Now.ToUniversalTime();
            //     var t2 = DateTime.Now.ToUniversalTime();
            //     var t3 = DateTime.Now.ToUniversalTime();
            //     var t4 = DateTime.Now.ToUniversalTime();
            //     var t5 = DateTime.Now.ToUniversalTime();
            //     var t6 = DateTime.Now.ToUniversalTime();

            //     modelBuilder.Entity<SensorData>().HasData(
            //         new SensorData { Id = 1, SensorId = 1, Value = 14, TimeStamp = t1 },
            //         new SensorData { Id = 2, SensorId = 2, Value = 100, TimeStamp = t1 },
            //         new SensorData { Id = 3, SensorId = 3, Value = 14, TimeStamp = t1 },

            //         new SensorData { Id = 4, SensorId = 1, Value = 10, TimeStamp = t2 },
            //         new SensorData { Id = 5, SensorId = 2, Value = 56, TimeStamp = t2 },
            //         new SensorData { Id = 6, SensorId = 3, Value = 48, TimeStamp = t2 },

            //         new SensorData { Id = 7, SensorId = 1, Value = 35, TimeStamp = t3 },
            //         new SensorData { Id = 8, SensorId = 2, Value = 78, TimeStamp = t3 },
            //         new SensorData { Id = 9, SensorId = 3, Value = 75, TimeStamp = t3 },

            //         new SensorData { Id = 10, SensorId = 1, Value = 45, TimeStamp = t4 },
            //         new SensorData { Id = 11, SensorId = 2, Value = 87, TimeStamp = t4 },
            //         new SensorData { Id = 12, SensorId = 3, Value = 92, TimeStamp = t4 },

            //         new SensorData { Id = 13, SensorId = 1, Value = 3, TimeStamp = t5 },
            //         new SensorData { Id = 14, SensorId = 2, Value = 59, TimeStamp = t5 },
            //         new SensorData { Id = 15, SensorId = 3, Value = 64, TimeStamp = t5 },

            //         new SensorData { Id = 16, SensorId = 1, Value = 34, TimeStamp = t6 },
            //         new SensorData { Id = 17, SensorId = 2, Value = 77, TimeStamp = t6 },
            //         new SensorData { Id = 18, SensorId = 3, Value = 83, TimeStamp = t6 }
            //     );
            //     log.LogInformation("Успешно");
            // }
            // catch (System.Exception e)
            // {
            //     log.LogInformation("Не удалось сидировать данные сенсоров");
            //     log.LogInformation(e.Message);
            // }

        }
    } // class
}
