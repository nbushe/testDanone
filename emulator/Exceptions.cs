namespace Emulator
{
    public class MissingApiUrlException : Exception
    {
        public MissingApiUrlException(string message) : base(message)
        {
        }
    }
}