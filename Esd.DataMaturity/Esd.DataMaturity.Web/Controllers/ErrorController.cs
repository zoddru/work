using System;
using System.Web.Http;
using Esd.DataMaturity.Web.Data;
using NLog;

namespace Esd.DataMaturity.Web.Controllers
{
    public class ErrorController : ApiController
    {
        private static readonly Logger logger = LogManager.GetCurrentClassLogger();

        // GET: error
        public string Get()
        {
            logger.Error("error");
            throw new Exception("error");
        }


        // POST: error
        public void Post(Error data)
        {
            data = data ?? new Error();
            new DataAccess().SaveError(data.message, data.info, data.userIdentifier);
        }


        public class Error
        {
            public string userIdentifier { get; set; }
            public string message { get; set; }
            public string info { get; set; }
        }
    }
}
