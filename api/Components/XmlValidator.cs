
using System.Xml.Linq;
using System.Xml.Schema;
using api.Model;
using Microsoft.EntityFrameworkCore;

namespace api.Components
{
    public class XmlValidator(ILogger logger, IConfiguration configuration, SensorsContext db) : IXmlValidator
    {

        private readonly string _schemaFileName = configuration["SchemaFileName"] ?? "";

        /// <summary>
        /// Сохраняет XML данные в базу данных
        /// </summary>
        /// <param name="content"></param>
        /// <returns></returns> <summary>
        /// 
        /// </summary>
        /// <param name="content"></param>
        /// <returns></returns>
        public Task<bool> SaveXmlData(XmlData content)
        {

            try
            {
                db.XmlData.Add(content);
                db.SaveChanges();
            }
            catch (System.Exception e)
            {
                logger.LogError("Ошибка при сохранении XML данных в базу данных: {Error}", e.Message);
                return Task.FromResult(false);
            }
            return Task.FromResult(true);
        }

        /// <summary>
        /// Проверяет содержимое XML на соответствие схеме
        /// </summary>
        /// <param name="content">Содержимое XML для проверки</param>
        /// <returns>True, если содержимое XML действително, иначе false</returns>
        public bool ValidateXML(string content)
        {
            if (_schemaFileName == "")
            {
                logger.LogError("Не задано имя файла схемы XML");
                return false;
            }
            XmlSchemaSet schema = new();
            schema.Add("", _schemaFileName);

            XDocument xmlDoc = XDocument.Parse(content);
            bool errors = false;
            xmlDoc.Validate(schema, (o, e) =>
            {
                errors = true;
                logger.LogError("Ошибка валидации содержимого XML: {Error}", e.Message);
            });

            return !errors;
        }
    }

}


