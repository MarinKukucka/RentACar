namespace RentACar.Application.Common.Models.Pagination
{
    public class PaginationFilter<TFilter> where TFilter : class
    {
        public TFilter? Filter { get; set; }
        public int CurrentPage { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string SortBy { get; set; } = "Id";
        public string SortOrder { get; set; } = "Ascend";
    }
}
