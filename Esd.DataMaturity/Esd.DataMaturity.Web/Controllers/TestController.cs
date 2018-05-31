using System;
using System.Data;
using System.Data.SqlClient;
using System.Web.Http;
using Esd.DataMaturity.Web.Data;
using NLog;

namespace Esd.DataMaturity.Web.Controllers
{
    public class TestController : ApiController
    {
        private static readonly Logger logger = LogManager.GetCurrentClassLogger();

        // GET: test
        public string Get()
        {
            TestStuff();
            
            return new DataAccess().GetTest();
        }

        private static int TestStuff()
        {
            var table = new DataTable();

            table.Columns.Add("identifier", typeof (string)).MaxLength = 100;
            table.Columns.Add("label", typeof (string)).MaxLength = 100;

            var row = table.NewRow();
            row["identifier"] = "01234567890123456789012391012345678901234534567892345678901234567891";
            row["label"] = "WORLD";
            table.Rows.Add(row);

            using (var connection = new SqlConnection(DataAccess.ConnectionString))
            {
                try
                {
                    var command = new SqlCommand("SprocTest", connection) {CommandType = CommandType.StoredProcedure};

                    command.Parameters.Add(new SqlParameter
                    {
                        ParameterName = "@items",
                        SqlDbType = SqlDbType.Structured,
                        TypeName = "Item",
                        Value = table
                    });

                    connection.Open();

                    return command.ExecuteNonQuery();
                }
                finally
                {
                    connection.Close();
                }
            }
        }
    }
}
