using System.Web.Http;
using Esd.DataMaturity.Web.Data;
using Esd.DataMaturity.Web.Models;

namespace Esd.DataMaturity.Web.Controllers
{
    public class SurveyController : ApiController
    {
        public Survey Get()
        {
            return new DataAccess().GetSurvey();
        }
    }
}
