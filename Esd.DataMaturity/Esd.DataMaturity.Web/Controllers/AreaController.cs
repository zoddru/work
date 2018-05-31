using System.Web.Http;
using Esd.DataMaturity.Web.Data;
using Esd.DataMaturity.Web.Models;
using Esd.DataMaturity.Web.Models.Webservices;
using Area = Esd.DataMaturity.Web.Models.Webservices.Area;

namespace Esd.DataMaturity.Web.Controllers
{
    public class AreaController : ApiController
    {
        [HttpPut]
        public ActionResponse Put(Area area)
        {
            var success = new AreaDataAccess().SaveArea(area);

            return new ActionResponse
            {
                success = success,
                message = success ? null : "failed to save area"
            };
        }
    }
}
