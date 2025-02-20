using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.Annotations;


namespace api.Model
{
    [SwaggerSchema("Данные с датчика")]
    [SwaggerTag("Данные с датчика")]
    [Description("Класс, представляющий данные с датчика")]
    [PrimaryKey("Id")]
    // [Index("TimeStamp")]
    public class SensorData
    {
        [SwaggerParameter("Идентификатор данных")]
        public int Id { get; set; }

        [SwaggerParameter("Метка времени")]
        [Column("TimeStamp")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime TimeStamp { get; set; }

        [SwaggerParameter("Значение данных")]
        public int Value { get; set; }

        [SwaggerParameter("Идентификатор датчика")]
        public int SensorId { get; set; }

        // Навигационное свойство
        [SwaggerParameter("Датчик")]
        [JsonIgnore]
        public virtual Sensor? Sensor { get; set; }



    }
}


