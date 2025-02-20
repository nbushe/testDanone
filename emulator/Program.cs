using System;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Console;
using DotNetEnv;

namespace Emulator
{
    public class Program
    {
        static async Task Main(string[] args)
        {
            // Загрузка конфигурации из .env
            Env.Load(); // Загружаем переменные из файла .env

            // Чтение параметров из переменных окружения средствами System
            var apiUrl = Environment.GetEnvironmentVariable("API_URL") ?? "http://localhost:5234";

            // Проверка, задан ли адрес API
            if (apiUrl == "")
            {
                throw new MissingApiUrlException("Не задан адрес API");
            }
            Console.WriteLine("Эмулятор запущен.");
            Console.WriteLine($"Адрес API: {apiUrl}");
            bool loggingEnabled = Env.GetBool("LOGGING", true);
            if (loggingEnabled){
                Console.WriteLine("Логирование включено.");
            } else {
                Console.WriteLine("Логирование отключено.");
            }

            // Настройка сервисов
            var services = new ServiceCollection();
            ConfigureServices(services, loggingEnabled);

            // Создание провайдера сервисов
            using var serviceProvider = services.BuildServiceProvider();

            // Получение логгера
            var logger = serviceProvider.GetRequiredService<ILogger<Program>>();
            logger.LogInformation("[Sensor Emulator] Starting Sensor Emulator...");

            // Создаем HttpClient с LoggingHandler
            var loggingHandler = new LoggingHandler(serviceProvider.GetRequiredService<ILogger<LoggingHandler>>())
            {
                InnerHandler = new HttpClientHandler()
            };

            using var httpClient = new HttpClient(loggingHandler);

            // Инициализируем эмулятор
            var emulator = new SensorEmulator(httpClient, apiUrl, serviceProvider.GetRequiredService<ILogger<SensorEmulator>>());

            // Токен отмены для остановки эмулятора
            using var cts = new CancellationTokenSource();

            // Обработка сигнала завершения (например, Ctrl+C)
            Console.CancelKeyPress += (sender, eventArgs) =>
            {
                logger.LogInformation("[Sensor Emulator] Stopping Sensor Emulator...");
                cts.Cancel();
                eventArgs.Cancel = true;
            };

            // Запуск эмулятора
            await emulator.StartAsync(cts.Token);

            logger.LogInformation("[Sensor Emulator] Sensor Emulator stopped.");
        }

        private static void ConfigureServices(IServiceCollection services, bool loggingEnabled)
        {
            // Добавление логгера
            services.AddLogging(builder =>
            {
                builder.AddConsole(options =>
                {
                    options.FormatterName = "custom"; // Используем наш форматтер
                });

                builder.AddConsoleFormatter<CustomConsoleFormatter, ConsoleFormatterOptions>();

                if (!loggingEnabled)
                {
                    builder.ClearProviders(); // Отключение логгера, если LOGGING=false
                }
            });

            // Регистрация других сервисов
            services.AddSingleton<SensorEmulator>();
        }
    }
}