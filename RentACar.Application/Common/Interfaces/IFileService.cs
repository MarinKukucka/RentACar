using Microsoft.AspNetCore.Http;

namespace RentACar.Application.Common.Interfaces
{
    public interface IFileService
    {
        Task<string> SaveFileAsync(IFormFile file, string[] allowedFileExtensions);
        Task DeleteFile(string url);
        string SeedFile(string sourceFilePath);
    }
}
