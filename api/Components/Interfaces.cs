using api.Model;

namespace api.Components
{
    /// <summary>
    /// Обменивается данными с базой данных
    /// </summary>
    public interface ISensorDataRepository
    {
        /// <summary>
        ///  Получает данные за заданный период времени.
        /// </summary>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <returns></returns>
        object GetSensorData(DateTime startDate, DateTime endDate);

        /// <summary>
        ///  Получает агрегированные данные (среднее, максимум, минимум) за указанный период.
        /// </summary>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <returns></returns>
        object GetSensorSummary(DateTime startDate, DateTime endDate);

        /// <summary>
        /// Принимает данные от эмулятора датчиков и сохраняет их в базе.
        /// </summary>
        /// <param name="data"></param> 
        void SaveSensorData(List<SensorData> data);
    }

    public interface IXmlValidator
    {
        /// <summary>
        /// Сохраняет XML данные в базу данных
        /// </summary>
        /// <param name="content"></param>
        /// <returns></returns> <summary>
        /// 
        /// </summary>
        /// <param name="content"></param>
        /// <returns></returns>
        Task<bool> SaveXmlData(XmlData content);

        /// <summary>
        /// Проверяет файл XML на соответствие схеме
        /// </summary>
        /// <param name="content">содержимое XML файла для проверки</param>
        /// <returns>True, если файл XML действителен и схема задана (в конфигурации), 
        /// иначе false
        /// </returns>
        bool ValidateXML(string content);
    }
}
