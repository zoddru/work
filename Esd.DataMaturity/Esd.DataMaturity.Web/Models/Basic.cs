using System;

namespace Esd.DataMaturity.Web.Models
{
    public class Basic
    {
        public string identifier { get; set; }
        public string label { get; set; }

        internal static TBasic CreateFromReader<TBasic>(System.Data.IDataReader r)
            where TBasic : Basic, new()
        {
            return new TBasic
            {
                identifier = Convert.ToString(r["identifier"]),
                label = Convert.ToString(r["label"])
            };
        }

        internal static TBasic CreateSortableFromReader<TBasic>(System.Data.IDataReader r)
            where TBasic : Basic, ISortable, new()
        {
            return new TBasic
            {
                identifier = Convert.ToString(r["identifier"]),
                label = Convert.ToString(r["label"]),
                sort = Convert.ToInt32(r["sort"])
            };
        }
    }
}