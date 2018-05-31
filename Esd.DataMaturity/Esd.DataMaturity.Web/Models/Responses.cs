using System.Collections.Generic;

namespace Esd.DataMaturity.Web.Models
{
    public class Responses
    {
        public Respondent respondent { get; set; }
        public List<Response> responses { get; set; }

        public Responses()
        {
            responses = new List<Response>();
        }

        public string validationError
        {
            get
            {
                if (respondent == null)
                    return "no respondent";
                if (!respondent.isValid)
                    return respondent.validationError;

                for (int i = 0; i < responses.Count; i++)
                {
                    var response = responses[i];
                    if (!response.isValid)
                        return "invalid response (index: " + i + ") - " + respondent.validationError;

                    if (response.respondent != respondent.identifier)
                        return "invalid response (index: " + i + ") - invalid respondent";
                }

                return string.Empty;
            }
        }
       
        public bool isValid
        {
            get { return string.IsNullOrEmpty(validationError); }
        }
    }
}