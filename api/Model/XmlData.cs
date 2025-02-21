using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.Annotations;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Model
{
    /// <summary>
    /// Класс для хранения данных XML
    /// </summary>
    [PrimaryKey("Id")]
    // [Index("TimeStamp")]
    public class XmlData
    {
        /// <summary>
        /// Уникальный идентификатор
        /// </summary>
        [Key]
        [Column("Id")]
        public int Id { get; set; }
        
        /// <summary>
        /// Метка времени
        /// </summary>
        /// 
        [SwaggerParameter("Метка времени")]
        [Column("TimeStamp")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime? TimeStamp { get; set; } 
        
        /// <summary>
        /// Данные XML
        /// </summary>
        [SwaggerParameter("XML")]
        [Column("Xml")]
        public string? Xml { get; set; }
    }
}
