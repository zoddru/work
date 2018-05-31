using System.Collections.Generic;
using System.Data;

namespace Esd.DataMaturity.Web.Models.Webservices
{
    public class Area : JsonItem
    {
        public AreaType areaType { get; set; }
        public Organisation governedBy { get; set; }
        public List<AreaGroup> memberOf { get; set; }
        public List<AreaGroup> ownerOf { get; set; }
    }

    public abstract class JsonItem
    {
        public string identifier { get; set; }
        public string label { get; set; }

        internal virtual Dictionary<string, object> GetInsertParameters()
        {
            return new Dictionary<string, object>
            {
                { "@identifier", identifier },
                { "@label", label },
            };
        }

        internal static DataTable GetTableParameter<TItem>(List<TItem> items)
            where TItem : JsonItem
        {
            var table = new DataTable();

            table.Columns.Add("identifier", typeof(string)).MaxLength = MaxIdentifierLength;
            table.Columns.Add("label", typeof(string));

            items.ForEach(item =>
            {
                var row = table.NewRow();
                row["identifier"] = Cap(item.identifier);
                row["label"] = item.label;
                table.Rows.Add(row);
            });

            return table;
        }

        internal static DataTable GetPairsTableParameter(List<string> firstIdentifiers, string secondIdentifier)
        {
            var table = new DataTable();

            table.Columns.Add("identifier1", typeof(string)).MaxLength = MaxIdentifierLength;
            table.Columns.Add("identifier2", typeof(string)).MaxLength = MaxIdentifierLength;

            firstIdentifiers.ForEach(identifier =>
            {
                var row = table.NewRow();
                row["identifier1"] = Cap(identifier);
                row["identifier2"] = Cap(secondIdentifier);
                table.Rows.Add(row);
            });

            return table;
        }

        public static readonly int MaxIdentifierLength = 100;
        protected static string Cap(string value)
        {
            int max = MaxIdentifierLength;
            if (string.IsNullOrEmpty(value))
                return value;
            if (value.Length > max)
                return value.Substring(0, max);
            return value;
        }
    }

    public class AreaType : JsonItem
    {
    }

    public class Organisation : JsonItem
    {
    }

    public class AreaGroup : JsonItem
    {
        public AreaGroupType type { get; set; }

        internal override Dictionary<string, object> GetInsertParameters()
        {
            var parameters = base.GetInsertParameters();
            parameters.Add("@type", type.identifier);
            return parameters;
        }

        public bool IsValid
        {
            get { return !string.IsNullOrEmpty(identifier) && type != null; }
        }

        internal new static DataTable GetTableParameter<TItem>(List<TItem> items)
            where TItem : AreaGroup
        {
            var table = new DataTable();

            table.Columns.Add("identifier", typeof(string)).MaxLength = MaxIdentifierLength;
            table.Columns.Add("label", typeof(string));
            table.Columns.Add("type", typeof(string)).MaxLength = MaxIdentifierLength;

            items.ForEach(item =>
            {
                var row = table.NewRow();
                row["identifier"] = Cap(item.identifier);
                row["label"] = item.label;
                row["type"] = Cap(item.type.identifier);
                table.Rows.Add(row);
            });

            return table;
        }
    }

    public class AreaGroupType : JsonItem
    {
    }
}