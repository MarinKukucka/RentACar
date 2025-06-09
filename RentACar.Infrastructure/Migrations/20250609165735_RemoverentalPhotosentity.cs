using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RentACar.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoverentalPhotosentity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RentalPhotos");

            migrationBuilder.CreateTable(
                name: "FileRental",
                columns: table => new
                {
                    FilesId = table.Column<int>(type: "int", nullable: false),
                    RentalsId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FileRental", x => new { x.FilesId, x.RentalsId });
                    table.ForeignKey(
                        name: "FK_FileRental_Files_FilesId",
                        column: x => x.FilesId,
                        principalTable: "Files",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FileRental_Rentals_RentalsId",
                        column: x => x.RentalsId,
                        principalTable: "Rentals",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FileRental_RentalsId",
                table: "FileRental",
                column: "RentalsId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FileRental");

            migrationBuilder.CreateTable(
                name: "RentalPhotos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FileId = table.Column<int>(type: "int", nullable: true),
                    RentalId = table.Column<int>(type: "int", nullable: true),
                    RentalPhotoType = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RentalPhotos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RentalPhotos_Files_FileId",
                        column: x => x.FileId,
                        principalTable: "Files",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_RentalPhotos_Rentals_RentalId",
                        column: x => x.RentalId,
                        principalTable: "Rentals",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_RentalPhotos_FileId",
                table: "RentalPhotos",
                column: "FileId");

            migrationBuilder.CreateIndex(
                name: "IX_RentalPhotos_RentalId",
                table: "RentalPhotos",
                column: "RentalId");
        }
    }
}
