namespace api.Components
{

    public class CustomLogger : ILogger<string>, IDisposable
    {
        private bool _disposed = false;
        private static readonly object writeLock = new();

        public static void Log(string message)
        {
            lock (writeLock)
            {
                Console.WriteLine(message);
            }
        }

        public static void Log(string message, LogLevel logLevel)
        {
            lock (writeLock)
            {
                Console.WriteLine($"[{logLevel}]: {message}");
            }
        }

        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception?, string> formatter)
        {
            lock (writeLock)
            {
                Console.WriteLine($"[{logLevel}]: {formatter(state, exception)}");
            }
        }

        public IDisposable BeginScope<TState>(TState state) where TState : notnull
        {
            return this;
        }

        public bool IsEnabled(LogLevel logLevel)
        {
            return true;
        }

        public void Dispose()
        {
            Dispose(true);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (_disposed) return;

            if (disposing)
            {
                // Release managed resources here if any
            }

            _disposed = true;
        }
    }
}