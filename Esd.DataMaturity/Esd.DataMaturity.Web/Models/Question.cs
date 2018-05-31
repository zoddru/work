using System;
using System.Collections.Generic;

namespace Esd.DataMaturity.Web.Models
{
    public class Question
    {
        internal string category { get; set; }
        public int identifier { get; set; }
        public string text { get; set; }
        public string help { get; set; }
        public string subCategory { get; set; }

        public List<Answer> answers { get; set; }

        internal static Question CreateFromReader(System.Data.IDataReader r)
        {
            return new Question
            {
                category = Convert.ToString(r["category"]),
                identifier = Convert.ToInt32(r["identifier"]),
                text = Convert.ToString(r["text"]),
                help = Convert.ToString(r["help"]),
                subCategory = Convert.ToString(r["subCategory"])
            };
        }
    }
}