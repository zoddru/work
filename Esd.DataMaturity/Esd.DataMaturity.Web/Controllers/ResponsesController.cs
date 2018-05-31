using System.Linq;
using System.Web.Http;
using Esd.DataMaturity.Web.Data;
using Esd.DataMaturity.Web.Models;

namespace Esd.DataMaturity.Web.Controllers
{
    public class ResponsesController : ApiController
    {
        public object Get(string identifier = null, string respondent = null, string organisation = null, string area = null, string department = null, string role = null, string owner = null)
        {
            if (!string.IsNullOrEmpty(identifier))
                return new DataAccess().GetResponses(identifier).FirstOrDefault();
            return new DataAccess().GetResponses(respondent, organisation, area, department, role, owner);
        }

        [HttpPut]
        public ActionResponse Put(Responses responses)
        {
            if (!responses.isValid)
            {
                return new ActionResponse
                {
                    success = false,
                    message = responses.validationError
                };
            }

            var success = new DataAccess().SaveResponses(responses);

            return new ActionResponse
            {
                success = success,
                message = success ? null : "failed to save responses"
            };
        }
    }
}
