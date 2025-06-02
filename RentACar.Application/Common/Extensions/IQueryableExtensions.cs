using Microsoft.EntityFrameworkCore;
using RentACar.Application.Common.Helpers;
using RentACar.Application.Common.Models.Pagination;
using System.Linq.Dynamic.Core;

namespace RentACar.Application.Common.Extensions
{
    public static class IQueryableExtensions
    {
        public static Task<PaginationResponse<TDestination>> PaginatedListAsync<TDestination>(this IQueryable<TDestination> queryable, int pageNumber, int pageSize) where TDestination : class
            => PaginationResponse<TDestination>.CreateAsync(queryable.AsNoTrackingWithIdentityResolution(), pageNumber, pageSize);

        public static Task<List<TDestination>> ProjectToListAsync<TDestination>(this IQueryable queryable, TypeAdapterConfig configuration) where TDestination : class
            => queryable.ProjectToType<TDestination>(configuration).AsNoTrackingWithIdentityResolution().ToListAsync();

        public static IQueryable<TEntity> Filter<TEntity, TRequest>(this IQueryable<TEntity> source, TRequest filter)
        {
            if (filter == null)
            {
                return source;
            }

            foreach (var prop in filter.GetType().GetProperties())
            {
                var propValue = prop.GetValue(filter);

                if (propValue != null)
                {
                    var propPredicate = PropertyHelper.GetPredicate(prop.Name);

                    if (propValue is string)
                    {
                        source = source.Where(string.Format("({0}).ToLower().Contains(@0)", propPredicate), propValue.ToString()?.ToLower());
                    }
                    else if (propValue is bool)
                    {
                        source = source.Where(string.Format("({0}) == @0", propPredicate), propValue);
                    }
                    else if (propValue is int)
                    {
                        source = source.Where(string.Format("({0}) == @0", propPredicate), propValue);
                    }
                    else if (propValue is List<int> list)
                    {
                        var predicate = string.Join(" OR ", list.Select(propValuePart => string.Format("({0}) == {1}", propPredicate, propValuePart)));

                        source = source.Where(predicate);
                    }
                    else if (propValue is DateTime propValueAsDatetime)
                    {
                        try
                        {
                            source = source.Where(string.Format("({0}).Date == @0", propPredicate), propValueAsDatetime.Date);
                        }
                        catch
                        {
                            source = source.Where(string.Format("({0}).Value.Date == @0", propPredicate), propValueAsDatetime.Date);
                        }
                    }
                    else if (propValue is DateOnly propValueAsDateOnly)
                    {
                        try
                        {
                            source = source.Where(string.Format("({0}) == @0", propPredicate), propValueAsDateOnly);
                        }
                        catch
                        {
                            source = source.Where(string.Format("({0}).Value == @0", propPredicate), propValueAsDateOnly);
                        }
                    }
                    else if (propValue is DateTimeOffset propValueAsDateTimeOffset)
                    {
                        try
                        {
                            source = source.Where(string.Format("({0}).Date == @0", propPredicate), propValueAsDateTimeOffset.Date);
                        }
                        catch
                        {
                            source = source.Where(string.Format("({0}).Value.Date == @0", propPredicate), propValueAsDateTimeOffset.Date);
                        }
                    }

                }
            }

            return source;
        }
        public static IQueryable<TEntity> Sort<TEntity>(this IQueryable<TEntity> source, string? sortBy, string? sortOrder, bool uniqueSort = false)
        {
            if (string.IsNullOrEmpty(sortBy))
            {
                return source;
            }

            var sortQuery = PropertyHelper.GetPredicate(sortBy);

            if (sortOrder == "descend")
            {
                sortQuery += " desc";
            }

            return uniqueSort
                ? source.OrderBy(sortQuery).ThenBy("Id")
                : source.OrderBy(sortQuery);
        }
    }
}
