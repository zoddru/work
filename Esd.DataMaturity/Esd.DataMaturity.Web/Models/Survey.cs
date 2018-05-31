using System.Collections.Generic;

namespace Esd.DataMaturity.Web.Models
{
    public class Survey
    {
        public string identifier { get { return "DM"; } }

        public string label { get { return "Data Maturity"; } }

        public List<Category> categories { get; set; } 
    }
}