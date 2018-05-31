using System;
using System.Collections.Generic;

namespace Esd.DataMaturity.Web.Models
{
    public class Respondent
    {
        public string identifier { get; set; }
        public string email { get; set; }
        public string organisation { get; set; }
        public string area { get; set; }
        public string department { get; set; }
        public string role { get; set; }
        public DateTime created { get; set; }
        public DateTime lastSeen { get; set; }
        public DateTime lastUpdated { get; set; }

        public string isCompleteMessage
        {
            get
            {
                if (!isValid)
                    return validationError;
                if (string.IsNullOrEmpty(department))
                    return "no department";
                if (string.IsNullOrEmpty(role))
                    return "no role";
                if (created.IsValidSqlServerData())
                    return "invalid created date";
                if (lastSeen.IsValidSqlServerData())
                    return "invalid lastSeen date";
                if (lastUpdated.IsValidSqlServerData())
                    return "invalid lastUpdated date";
                return string.Empty;
            }
        }

        public bool isComplete
        {
            get { return string.IsNullOrEmpty(isCompleteMessage); }
        }

        public string validationError
        {
            get
            {
                if (string.IsNullOrEmpty(identifier))
                    return "no respondent identifier";
                if (created.IsValidSqlServerData())
                    return "invalid created date";
                if (lastSeen.IsValidSqlServerData())
                    return "invalid lastSeen date";
                if (lastUpdated.IsValidSqlServerData())
                    return "invalid lastUpdated date";
                return string.Empty;
            }
        }

        public bool isValid
        {
            get { return string.IsNullOrEmpty(validationError); }
        }

        internal static Respondent CreateFromReader(System.Data.IDataReader r)
        {
            return new Respondent
            {
                identifier = Convert.ToString(r["identifier"]),
                email = Convert.ToString(r["email"]),
                organisation = Convert.ToString(r["organisation"]),
                area = r["area"] == DBNull.Value ? null : Convert.ToString(r["area"]),
                department = r["department"] == DBNull.Value ? null : Convert.ToString(r["department"]),
                role = r["role"] == DBNull.Value ? null : Convert.ToString(r["role"]),
                created = Convert.ToDateTime(r["created"]),
                lastSeen = Convert.ToDateTime(r["lastSeen"]),
                lastUpdated = Convert.ToDateTime(r["lastUpdated"]),
            };
        }

        internal Dictionary<string, object> GetUpsertParameters()
        {
            return new Dictionary<string, object>
            {
                { "@identifier", identifier },
                { "@email", email },
                { "@organisation", organisation },
                { "@area", area },
                { "@department", department },
                { "@role", role },
                { "@created", created },
                { "@lastSeen", lastSeen },
                { "@lastUpdated", lastUpdated },
            };
        }
    }
}