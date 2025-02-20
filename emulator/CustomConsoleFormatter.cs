using System;
using System.Text.RegularExpressions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Logging.Console;

namespace Emulator
{
    public partial class CustomConsoleFormatter : ConsoleFormatter
    {
        public CustomConsoleFormatter() : base("custom")
        {
        }

        // Обновлённый метод Write
        // public override void Write<TState>(in LogRecord logRecord, IExternalScopeProvider? scopeProvider, TextWriter textWriter)
        public override void Write<TState>(in LogEntry<TState> logEntry, IExternalScopeProvider? scopeProvider, TextWriter textWriter)
        {
            // // Определение цвета текста в зависимости от уровня логирования
            // var originalColor = Console.ForegroundColor;

            // Console.ForegroundColor = logEntry.LogLevel switch
            // {
            //     LogLevel.Information => ConsoleColor.Yellow,
            //     LogLevel.Warning => ConsoleColor.Yellow,
            //     LogLevel.Error => ConsoleColor.Red,
            //     LogLevel.Critical => ConsoleColor.Magenta,
            //     _ => ConsoleColor.Gray,
            // };
            // Определение цвета текста в зависимости от уровня логирования
            var colorCode = logEntry.LogLevel switch
            {
                LogLevel.Information => "37m", // белый
                LogLevel.Warning => "33m", // желтый
                LogLevel.Error => "31m", // красный
                LogLevel.Critical => "35m", // магента
                _ => "37m", // серый
            };
            // Форматирование сообщения
            var message = logEntry.Formatter(logEntry.State, logEntry.Exception);

            // Выделение текста в квадратных скобках зеленым цветом
            var formattedMessage = FormatMessageWithGreenBrackets(message, colorCode);

            // Вывод сообщения
            // textWriter.WriteLine(formattedMessage);
            textWriter.WriteLine($"\x1b[{colorCode}{formattedMessage}\x1b[0m");

            // // Восстановление исходного цвета
            // Console.ForegroundColor = originalColor;
        }

        private static string FormatMessageWithGreenBrackets(string message, string originalColor)
        {
            // Заменяем "\[(.*)\]"gm на \x1b[32m[$1]\x1b[0m
            return MyRegex().Replace(message, $"\x1b[32m[$1]\x1b[{originalColor}");
        }

        [GeneratedRegex(@"\[(.*)\]")]
        private static partial Regex MyRegex();
    }
}