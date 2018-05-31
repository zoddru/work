using System;

namespace Esd.DataMaturity.Web.Models
{
    public static class Utilities
    {
        public static readonly DateTime minSqlDate = new DateTime(1754, 1, 1, 12, 0, 0);
        public static readonly DateTime maxSqlDate = new DateTime(9999, 12, 1, 11, 59, 59);

        public static bool IsValidSqlServerData(this DateTime dateTime)
        {
            return dateTime < minSqlDate || dateTime > maxSqlDate;
        }
    }
}