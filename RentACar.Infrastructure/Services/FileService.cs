using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using RentACar.Application.Common.Interfaces;

namespace RentACar.Infrastructure.Services
{
    public class FileService(
        IWebHostEnvironment environment,
        IHttpContextAccessor httpContextAccessor) : IFileService
    {
        private const string UPLOADS_FOLDER = "Uploads";

        /// <summary>
        /// Persists the file locally
        /// </summary>
        /// <param name="file"></param>
        /// <param name="allowedFileExtensions"></param>
        /// <returns>Url of the saved file</returns>
        /// <exception cref="ArgumentException"></exception>
        /// <exception cref="ArgumentNullException"></exception>
        public async Task<string> SaveFileAsync(IFormFile file, string[] allowedFileExtensions)
        {
            var path = Path.Combine(environment.WebRootPath, UPLOADS_FOLDER);

            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }

            var ext = Path.GetExtension(file.FileName);

            // Check the allowed extenstions
            if (!allowedFileExtensions.Contains(ext))
            {
                throw new ArgumentException("File extension is not valid");
            }

            // generate a unique filename
            var fileName = $"{Guid.NewGuid()}{ext}";
            var fileNameWithPath = Path.Combine(UPLOADS_FOLDER, fileName);
            var fullPath = Path.Combine(environment.WebRootPath, fileNameWithPath);

            using var stream = new FileStream(fullPath, FileMode.Create);
            await file.CopyToAsync(stream);

            var context = httpContextAccessor.HttpContext;

            var appBaseUrl = $"{context?.Request.Scheme}://{context?.Request.Host}{context?.Request.PathBase}";

            return Path.Combine(appBaseUrl, fileNameWithPath);
        }

        public Task DeleteFile(string url)
        {
            var context = httpContextAccessor.HttpContext;

            var appBaseUrl = $"{context?.Request.Scheme}://{context?.Request.Host}{context?.Request.PathBase}";

            var fileNameWithPath = url.Replace(appBaseUrl, "").TrimStart('\\');

            var fullPath = Path.Combine(environment.WebRootPath, fileNameWithPath);

            if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
            }

            return Task.CompletedTask;
        }

        public string SeedFile(string sourceFilePath)
        {
            var ext = Path.GetExtension(sourceFilePath);
            var allowedFileExtensions = new[] { ".jpg", ".jpeg", ".png" };

            if (!allowedFileExtensions.Contains(ext))
            {
                throw new ArgumentException("File extension is not valid");
            }

            var uploadsFolder = Path.Combine(environment.WebRootPath, UPLOADS_FOLDER);
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var fileName = $"{Guid.NewGuid()}{ext}";
            var destinationPath = Path.Combine(uploadsFolder, fileName);

            File.Copy(sourceFilePath, destinationPath, overwrite: true);

            return Path.Combine(UPLOADS_FOLDER, fileName).Replace("\\", "/");
        }

    }
}
