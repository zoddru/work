using System;
using System.Collections.Generic;

namespace Esd.DataMaturity.Web.Models
{
    public class Response
    {
        public string respondent { get; set; }
        public string category { get; set; }
        public int question { get; set; }
        public int? value { get; set; }
        public bool notKnown { get; set; }
        public bool notUnderstood { get; set; }
        public DateTime created { get; set; }
        public DateTime lastUpdated { get; set; }

        public string validationError
        {
            get
            {
                if (string.IsNullOrEmpty(respondent))
                    return "no respondent";
                if (string.IsNullOrEmpty(category))
                    return "no category";
                if (notKnown && notUnderstood)
                    return "not known and not understood both specified";
                if (notKnown && value.HasValue)
                    return "not known and value specified";
                if (notUnderstood && value.HasValue)
                    return "not understood and value specified";
                if (!notKnown && !notUnderstood && !value.HasValue)
                    return "no value specified";
                if (created.IsValidSqlServerData())
                    return "invalid created date";
                if (lastUpdated.IsValidSqlServerData())
                    return "invalid lastUpdated date";
                return string.Empty;
            }
        }

        public bool isValid
        {
            get { return string.IsNullOrEmpty(validationError); }
        }

        internal static Response CreateFromReader(System.Data.IDataReader r)
        {
            return new Response
            {
                respondent = Convert.ToString(r["respondent"]),
                category = Convert.ToString(r["category"]),
                question = Convert.ToInt32(r["question"]),
                value = r["value"] == DBNull.Value ? null : (int?)Convert.ToInt32(r["value"]),
                notKnown = Convert.ToBoolean(r["notKnown"]),
                notUnderstood = Convert.ToBoolean(r["notUnderstood"]),
                created = Convert.ToDateTime(r["created"]),
                lastUpdated = Convert.ToDateTime(r["lastUpdated"]),
            };
        }

        internal Dictionary<string, object> GetUpsertParameters()
        {
            return new Dictionary<string, object>
            {
                { "@respondent", respondent },
                { "@category", category },
                { "@question", question },
                { "@value", value },
                { "@notKnown", notKnown },
                { "@notUnderstood", notUnderstood },
                { "@created", created },
                { "@lastUpdated", lastUpdated },
            };
        }
    }
}