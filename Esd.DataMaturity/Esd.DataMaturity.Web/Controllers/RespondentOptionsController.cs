using System.Collections.Generic;
using System.Web.Http;
using Esd.DataMaturity.Web.Data;
using Esd.DataMaturity.Web.Models;

namespace Esd.DataMaturity.Web.Controllers
{
    public class RespondentOptionsController : ApiController
    {
        public object Get(string owner = null, string respondent = null)
        {
            var dataAccess = new DataAccess();
            var departments = dataAccess.GetBasicList<Department>();
            var roles = dataAccess.GetBasicList<Role>();
            var areaGroupTypes = dataAccess.GetAreaGroupTypes(); // obsolete
            var areaGroups = owner != null
                ? GetAreaGroupsByOwner(owner)
                : GetAreaGroupsByRespondent(respondent);
            
            return new
            {
                areaGroups,
                departments,
                roles,

                // obsolete
                areaGroupTypes
            };
        }

        private static List<AreaGroup> GetAreaGroupsByRespondent(string respondentIdentifier)
        {
            if (string.IsNullOrEmpty(respondentIdentifier))
                return new List<AreaGroup>();
            var dataAccess = new DataAccess();
            var respondent = dataAccess.GetRespondent(respondentIdentifier);
            if (respondent == null || respondent.area == null)
                return new List<AreaGroup>();
            return GetAreaGroupsByOwner(respondent.area);
        }

        private static List<AreaGroup> GetAreaGroupsByOwner(string owner)
        {
            var areaDataAccess = new AreaDataAccess();
            return areaDataAccess.GetAreaGroups(owner);
        }
    }
}
