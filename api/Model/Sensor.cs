
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace api.Model
{
    /// <summary>
    /// Датчик
    /// </summary>
    [PrimaryKey("Id")]
    public class Sensor
    {
        /// <summary>
        /// Идентификатор датчика
        /// </summary>
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        /// <summary>
        /// Наименование датчика
        /// </summary>
        [Required]
        public required string Name { get; set; } = string.Empty;

        /// <summary>
        /// Данные датчика
        /// </summary>
        [JsonIgnore]
        public virtual List<SensorData> SensorData { get; set; } = [];
    }
}
