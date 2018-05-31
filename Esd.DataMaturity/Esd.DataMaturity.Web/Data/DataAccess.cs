using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using Esd.DataMaturity.Web.Models;
using NLog;

namespace Esd.DataMaturity.Web.Data
{
    internal class DataAccess
    {
        private static readonly Logger logger = LogManager.GetCurrentClassLogger();

        public Survey GetSurvey()
        {
            var survey = new Survey
            {
                categories = GetCategories()
            };

            var questions = ExecuteList(Question.CreateFromReader);
            var answers = ExecuteList(Answer.CreateFromReader);

            AttachAnswersToQuestions(questions, answers);

            foreach (var c in survey.categories)
            {
                c.questions = questions.Where(q => q.category == c.identifier).ToList();
            }

            return survey;
        }

        private static void AttachAnswersToQuestions(List<Question> questions, List<Answer> answers)
        {
            foreach (var q in questions)
            {
                var qa = answers.Where(a => q.category == a.category && q.identifier == a.question).OrderBy(a => a.sort).ToList();
                if (!qa.Any())
                    continue;
                q.answers = qa;
            }
        }


        private string GetSelectSql<T>()
        {
            return string.Format("select * from [{0}];", typeof(T).Name);
        }


        private string GetSortedSelectSql<T>()
        {
            return string.Format("select * from [{0}] order by sort;", typeof(T).Name);
        }


        private string GetSelectSqlWithIdentifier<T>()
        {
            return string.Format("select * from [{0}] where identifier = @identifier;", typeof(T).Name);
        }


        internal string GetSelectSqlWithFilter(string tableName, string fieldName)
        {
            return string.Format("select * from [{0}] where [{1}] = @{1};", tableName, fieldName);
        }


        internal List<TBasic> GetBasicList<TBasic>()
            where TBasic : Basic, new()
        {
            var list = new List<TBasic>();
            ExecuteReader(GetSelectSql<TBasic>(), r => list.Add(Basic.CreateFromReader<TBasic>(r)));
            return list;
        }


        internal List<TBasic> GetSortedList<TBasic>()
            where TBasic : Basic, ISortable, new()
        {
            var list = new List<TBasic>();
            ExecuteReader(GetSortedSelectSql<TBasic>(), r => list.Add(Basic.CreateSortableFromReader<TBasic>(r)));
            return list;
        }


        internal List<Category> GetCategories()
        {
            var list = new List<Category>();
            ExecuteReader(GetSortedSelectSql<Category>(), r =>
            {
                var category = Basic.CreateSortableFromReader<Category>(r);
                category.description = Convert.ToString(r["description"]);
                list.Add(category);
            });

            return list;
        }


        internal List<AreaGroupType> GetAreaGroupTypes()
        {
            var list = new List<AreaGroupType>();
            ExecuteReader(@"select * from AreaGroupType agt inner join AreaGroupTypeWhitelist w on agt.identifier = w.identifier order by label;", r => list.Add(Basic.CreateFromReader<AreaGroupType>(r)));
            return list;
        }


        internal List<Respondent> GetRespondents(string identifier = null, string organisation = null, string area = null, string department = null, string role = null, string owner = null)
        {
            var respondents = new List<Respondent>();

            var parameters = new Dictionary<string, object>();
            var sql = new StringBuilder(@"select * from [Respondent] where 1 = 1");

            if (!string.IsNullOrEmpty(identifier))
            {
                sql.Append(" and [identifier] = @identifier");
                parameters.Add("@identifier", identifier);
            }

            if (!string.IsNullOrEmpty(organisation))
            {
                sql.Append(" and [organisation] = @organisation");
                parameters.Add("@organisation", organisation);
            }

            if (!string.IsNullOrEmpty(area))
            {
                sql.Append(" and [area] = @area");
                parameters.Add("@area", area);
            }

            if (!string.IsNullOrEmpty(department))
            {
                sql.Append(" and [department] = @department");
                parameters.Add("@department", department);
            }

            if (!string.IsNullOrEmpty(role))
            {
                sql.Append(" and [role] = @role");
                parameters.Add("@role", role);
            }

            if (!string.IsNullOrEmpty(owner))
            {
                sql.Append(" and [area] in (select identifier from [AreaGroupByOwnerWithMember] where [owner] = @owner)");
                parameters.Add("@owner", owner);
            }

            ExecuteReader(sql.ToString(), r => respondents.Add(Respondent.CreateFromReader(r)), parameters);


            return respondents;
        }


        internal Respondent GetRespondent(string identifier)
        {
            Respondent respondent = null;
            ExecuteReader(GetSelectSqlWithIdentifier<Respondent>(), r => respondent = Respondent.CreateFromReader(r), new Dictionary<string, object> { { "@identifier", identifier } });
            return respondent;
        }


        internal bool SaveRespondent(Respondent respondent)
        {
            var parameters = respondent.GetUpsertParameters();
            return ExecuteNonQuery("UpsertRespondent", CommandType.StoredProcedure, parameters) != -1;
        }


        internal bool SaveResponse(Response response)
        {
            var parameters = response.GetUpsertParameters();
            return ExecuteNonQuery("UpsertResponse", CommandType.StoredProcedure, parameters) != -1;
        }

        internal List<Responses> GetResponses(string respondent = null, string organisation = null, string area = null, string department = null, string role = null, string owner = null)
        {
            var respondents = GetRespondents(respondent, organisation, area, department, role, owner);

            var sql = respondent != null ? "select * from [Response] where respondent = @respondent;" : GetSelectSql<Response>();
            var parameters = new Dictionary<string, object>();
            if (respondent != null)
                parameters.Add("@respondent", respondent);

            var allResponses = new List<Response>();
            ExecuteReader(sql, r => allResponses.Add(Response.CreateFromReader(r)), parameters);

            var responses = new List<Responses>();

            foreach (var person in respondents)
            {
                responses.Add(new Responses
                {
                    respondent = person,
                    responses = allResponses.Where(r => r.respondent == person.identifier).ToList()
                });
            }

            return responses;
        }
        
        internal bool SaveResponses(Responses responses)
        {
            return SaveRespondent(responses.respondent)
                   && responses.responses.All(SaveResponse);
        }
        
        public string GetTest()
        {
            string text = null;
            ExecuteReader("select [text] from [Test];", r => text = Convert.ToString(r["text"]));
            return text;
        }

        public bool SaveTest(string text)
        {
            return ExecuteNonQuery("update [Test] set [text] = @text;", CommandType.Text, new Dictionary<string, object> { { "@text", text } }) != -1;
        }


        public static string ConnectionString
        {
            get
            {
                return ConfigurationManager.ConnectionStrings["database"].ConnectionString; 
            }
        }


        private List<T> ExecuteList<T>(Func<IDataReader, T> create)
        {
            var items = new List<T>();
            ExecuteReader(GetSelectSql<T>(), r => items.Add(create(r)));
            return items;
        }


        internal void ExecuteReader(string query, Action<IDataReader> action, Dictionary<string, object> parameters = null)
        {
            using (var connection = new SqlConnection(ConnectionString))
            {
                var command = new SqlCommand(query, connection);

                if (parameters != null)
                {
                    foreach (var p in parameters)
                    {
                        command.Parameters.AddWithValue(p.Key, p.Value);
                    }
                }

                connection.Open();
                var reader = command.ExecuteReader();

                try
                {
                    while (reader.Read())
                    {
                        action(reader);
                    }
                }
                catch (Exception e)
                {
                    logger.Error(e);
                }
                finally
                {
                    reader.Close();
                }
            }
        }


        internal int ExecuteNonQuery(string query, CommandType commandType, Dictionary<string, object> parameters)
        {
            using (var connection = new SqlConnection(ConnectionString))
            {
                connection.Open();
                
                try
                {
                    return ExecuteNonQuery(connection, query, commandType, parameters);
                }
                catch (Exception e)
                {
                    logger.Error(e);
                    return -1;
                }
                finally
                {
                    connection.Close();
                }
            }
        }

        public int ExecuteNonQuery(string query, CommandType commandType, string parameterTypeName, string parameterName, DataTable parameterValue)
        {
            using (var connection = new SqlConnection(ConnectionString))
            {
                try
                {
                    var command = new SqlCommand(query, connection) { CommandType = commandType };

                    command.Parameters.Add(new SqlParameter
                    {
                        ParameterName = parameterName,
                        SqlDbType = SqlDbType.Structured,
                        TypeName = parameterTypeName,
                        Value = parameterValue
                    });

                    connection.Open();

                    return command.ExecuteNonQuery();
                }
                catch (Exception e)
                {
                    logger.Error(e);
                    return -1;
                }
                finally
                {
                    connection.Close();
                }
            }
        }


        internal int ExecuteNonQueryBatch(List<Command> commands)
        {
            using (var connection = new SqlConnection(ConnectionString))
            {
                connection.Open();

                try
                {
                    return commands.Min(c => ExecuteNonQuery(connection, c));
                }
                catch (Exception e)
                {
                    logger.Error(e);
                    return -1;
                }
                finally
                {
                    connection.Close();
                }
            }
        }


        internal class Command
        {
            public Command(string query, CommandType commandType, Dictionary<string, object> parameters)
            {
                Query = query;
                CommandType = commandType;
                Parameters = parameters;
            }

            public string Query { get; private set; }
            public CommandType CommandType { get; private set; }
            public Dictionary<string, object> Parameters { get; private set; }

            public string ToSql()
            {
                if (CommandType == CommandType.StoredProcedure)
                {
                    return "exec [" + Query + "] " + string.Join(",", Parameters.Select(p => p.Key).ToArray()) + ";";
                }

                return Query;
            }
        }


        private int ExecuteNonQuery(SqlConnection connection, Command command)
        {
            return ExecuteNonQuery(connection, command.Query, command.CommandType, command.Parameters);
        }


        private static int ExecuteNonQuery(SqlConnection connection, string query, CommandType commandType, Dictionary<string, object> parameters)
        {
            var command = new SqlCommand(query, connection) { CommandType = commandType };

            foreach (var p in parameters)
            {
                command.Parameters.AddWithValue(p.Key, p.Value);
            }

            return command.ExecuteNonQuery();
        }


        internal bool SaveError(string message = null, string info = null, string userIdentifier = null)
        {
            const string sql = "insert into [Error] ([userIdentifier], [message], [info]) values (@userIdentifier, @message, @info);";
            
            var parameters = new Dictionary<string, object>
            {
                { "@userIdentifier", (object)userIdentifier ?? DBNull.Value }, 
                { "@message", (object)message ?? DBNull.Value }, 
                { "@info", (object)info ?? DBNull.Value }
            };

            return ExecuteNonQuery(sql, CommandType.Text, parameters) != -1;
        }
    }
}