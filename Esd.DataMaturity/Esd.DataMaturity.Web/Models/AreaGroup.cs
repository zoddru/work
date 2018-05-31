using System.Collections.Generic;

namespace Esd.DataMaturity.Web.Models
{
    public class AreaGroup : Basic
    {
        public List<Area> members { get; private set; }

        public AreaGroup()
        {
            members = new List<Area>();
        }
    }
}