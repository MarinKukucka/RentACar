using Microsoft.EntityFrameworkCore;

namespace RentACar.Application.Common.Models.Pagination
{
    public class PaginationResponse<T>(IReadOnlyCollection<T> items, int totalItems, int currentPage, int pageSize)
    {
        public IReadOnlyCollection<T> Items { get; } = items;
        public int CurrentPage { get; } = currentPage;
        public int PageSize { get; } = pageSize;
        public int TotalPages { get; } = (int)Math.Ceiling(totalItems / (double)pageSize);
        public int TotalItems { get; } = totalItems;

        public static async Task<PaginationResponse<T>> CreateAsync(IQueryable<T> source, int currentPage, int pageSize)
        {
            var count = await source.CountAsync();
            var items = await source.Skip((currentPage - 1) * pageSize).Take(pageSize).ToListAsync();

            return new PaginationResponse<T>(items, count, currentPage, pageSize);
        }
    }

}
