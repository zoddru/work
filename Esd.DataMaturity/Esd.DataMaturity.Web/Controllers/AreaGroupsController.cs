using System.Web.Http;
using Esd.DataMaturity.Web.Data;

namespace Esd.DataMaturity.Web.Controllers
{
    public class AreaGroupsController : ApiController
    {
        public object Get(string owner)
        {
            return new AreaDataAccess().GetAreaGroups(owner);
        }
    }
}
