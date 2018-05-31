using System.Web.Http;
using Esd.DataMaturity.Web.Data;
using Esd.DataMaturity.Web.Models;

namespace Esd.DataMaturity.Web.Controllers
{
    public class RespondentsController : ApiController
    {
        public Respondent Get(string identifier)
        {
            return new DataAccess().GetRespondent(identifier);
        }

        [HttpPut]
        public ActionResponse Put(Respondent respondent)
        {
            var success = new DataAccess().SaveRespondent(respondent);

            return new ActionResponse
            {
                success = success,
                message = success ? null : "failed to save respondent"
            };
        }
    }
}
