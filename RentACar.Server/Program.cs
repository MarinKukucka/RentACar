using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using RentACar.Domain.Entities;
using RentACar.Infrastructure.Data.Context;
using RentACar.Infrastructure.Services;
using RentACar.Application.Common.Interfaces;
using RentACar.Application;
using RentACar.Infrastructure.Identity;
using RentACar.Application.Common.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplicationServices();

builder.Services.AddDbContext<ApplicationDbContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")).EnableSensitiveDataLogging() 
        .LogTo(Console.WriteLine, LogLevel.Information));

builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ApplicationDbContextInitialiser>();
builder.Services.AddScoped<IAuthService, IdentityAuthService>();
builder.Services.AddScoped<IIdentityService, IdentityService>();
builder.Services.AddScoped<RentACar.Infrastructure.Services.IEmailSender<ApplicationUser>, SmtpEmailSender>();
builder.Services.AddScoped<IFileService, FileService>();

builder.Services.AddScoped<IApplicationDbContext, ApplicationDbContext>();

builder.Services.AddHostedService<ReservationCleanupService>();

builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddOpenApiDocument(config =>
{
    config.Title = "My Title";
    config.Version = "1.0.0";
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowDevClient", policy =>
    {
        policy.WithOrigins("https://localhost:52044")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

Stripe.StripeConfiguration.ApiKey = builder.Configuration["Stripe:SecretKey"];


var app = builder.Build();

app.UseStaticFiles();

var connString = builder.Configuration.GetConnectionString("DefaultConnection");
if (!string.IsNullOrWhiteSpace(connString))
{
    await app.InitialiseDatabaseAsync();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowDevClient");

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapFallbackToFile("/index.html");

app.Run();