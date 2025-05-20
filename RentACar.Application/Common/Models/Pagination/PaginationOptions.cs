namespace RentACar.Application.Common.Models.Pagination
{
    public record PaginationOptions
    {
        public int CurrentPage { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? SortBy { get; set; }
        public string? SortOrder { get; set; }
    }
}
