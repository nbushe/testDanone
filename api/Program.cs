
using api.Components;
using api.Model;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace api
{
    public static class Api
    {
        // Точка входа в приложение
        public async static Task Main(string[] args)
        {

            // Создание билдера для веб-приложения
            var builder = WebApplication.CreateBuilder(args);
            // Регистрация сервисов
            builder.Services.AddControllers(); // Добавляем контроллеры
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });
                c.EnableAnnotations();
            });
            builder.Services.AddSingleton<ILogger, CustomLogger>(); // Добавляем наш логгер
            builder.Services.AddTransient<ISensorDataRepository, SensorDataRepository>(); // Добавляем репозиторий данных датчиков
            builder.Services.AddTransient<IXmlValidator, XmlValidator>();   // Добавляем валидатор XML
            builder.Services.AddDbContext<SensorsContext>(); // Добавляем контекст БД
            
            
            builder.WebHost.ConfigureKestrel(options =>
            {
                options.ListenAnyIP(5234); // HTTP
            });

            
            var app = builder.Build();
            // Конфигурация CORS
            app.UseCors(builder => builder.AllowAnyOrigin());

            // Конфигурация middleware
            if (app.Environment.IsDevelopment())
            {

                app.UseSwagger(); // Используем Swagger
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "API Версия 1");
                    c.RoutePrefix = string.Empty; // Устанавливаем префикс маршрута для Swagger UI
                });
            }

            // app.UseHttpsRedirection(); // Используем перенаправление HTTPS
            app.MapControllers(); // Поключаем контроллеры

            // Запуск приложения
            // Подключаем логирование в Main
            var logger = builder.Services.BuildServiceProvider().GetService<ILogger>();

            logger.LogInformation("API Сервис запущен");

            await app.RunAsync("http://localhost:5234"); // Запускаем приложение асинхронно
        }
    }
}

