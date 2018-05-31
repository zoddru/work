using System.Collections.Generic;

namespace Esd.DataMaturity.Web.Models
{
    public class Category : Basic, ISortable
    {
        public List<Question> questions { get; set; }

        public int sort { get; set; }

        public string description { get; set; }
    }
}