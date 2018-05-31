using System;

namespace Esd.DataMaturity.Web.Models
{
    public class Answer
    {
        internal string category { get; set; }
        internal int question { get; set; }
        public int value { get; set; }
        public string text { get; set; }
        public int sort{ get; set; }

        internal static Answer CreateFromReader(System.Data.IDataReader r)
        {
            return new Answer
            {
                category = Convert.ToString(r["category"]),
                question = Convert.ToInt32(r["question"]),
                value = Convert.ToInt32(r["value"]),
                text = Convert.ToString(r["text"]),
                sort = Convert.ToInt32(r["sort"]),
            };
        }
    }
}