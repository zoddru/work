using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Esd.DataMaturity.Web.Models;
using NLog;
using JsonItem = Esd.DataMaturity.Web.Models.Webservices.JsonItem;

namespace Esd.DataMaturity.Web.Data
{
    internal class AreaDataAccess
    {
        private static readonly Logger logger = LogManager.GetCurrentClassLogger();
        private readonly DataAccess DataAccess = new DataAccess();

        public bool SaveArea(Models.Webservices.Area area)
        {
            try
            {
                var result = DataAccess.ExecuteNonQuery("InsertIgnoreArea", CommandType.StoredProcedure, area.GetInsertParameters());
                if (result < 1)
                    return true; // assume it is already there 

                var memberOf = area.memberOf.Where(g => g.IsValid).ToList();
                var ownerOf = area.ownerOf.Where(g => g.IsValid).ToList();

                var areaGroupTypes = memberOf.Select(g => g.type).Union(ownerOf.Select(g => g.type)).DistinctBy(t => t.identifier).ToList();
                DataAccess.ExecuteNonQuery("InsertIgnoreAreaGroupTypes", CommandType.StoredProcedure, "Item", "@areaGroupTypes", JsonItem.GetTableParameter(areaGroupTypes));

                var areaGroups = memberOf.Select(g => g).Union(ownerOf.Select(g => g)).DistinctBy(g => g.identifier).ToList();
                DataAccess.ExecuteNonQuery("InsertIgnoreAreaGroups", CommandType.StoredProcedure, "TypedItem", "@areaGroups", Models.Webservices.AreaGroup.GetTableParameter(areaGroups));

                var parameters = JsonItem.GetPairsTableParameter(memberOf.Select(m => m.identifier).ToList(), area.identifier);
                DataAccess.ExecuteNonQuery("InsertIgnoreAreaGroupMembers", CommandType.StoredProcedure, "Pair", "@areaGroupMembers", parameters);

                parameters = JsonItem.GetPairsTableParameter(ownerOf.Select(m => m.identifier).ToList(), area.identifier);
                DataAccess.ExecuteNonQuery("InsertIgnoreAreaGroupOwners", CommandType.StoredProcedure, "Pair", "@areaGroupOwners", parameters);

                return true;
            }
            catch (Exception e)
            {
                logger.Error(e);
                return false;
            }
        }

        public List<AreaGroup> GetAreaGroups(string owner)
        {
            var areaGroups = new List<AreaGroup>();
            DataAccess.ExecuteReader(DataAccess.GetSelectSqlWithFilter("AreaGroupByOwner", "owner"), r => areaGroups.Add(Basic.CreateFromReader<AreaGroup>(r)), new Dictionary<string, object> { { "@owner", owner } });

            var pairs = new List<Tuple<string, Area>>();
            Action<IDataReader> addMember = r =>
            {
                var areaGroup = r["areaGroup"].ToString();
                pairs.Add(Tuple.Create(areaGroup, Basic.CreateFromReader<Area>(r)));
            };
            DataAccess.ExecuteReader(DataAccess.GetSelectSqlWithFilter("AreaGroupByOwnerWithMember", "owner"), addMember, new Dictionary<string, object> { { "@owner", owner } });

            foreach (var areaGroup in areaGroups)
            {
                areaGroup.members.AddRange(pairs.Where(p => p.Item1 == areaGroup.identifier).Select(p => p.Item2));
            }
            
            return areaGroups;
        }
    }
}