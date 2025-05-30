using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RentACar.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddLocationImage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "FileId",
                table: "Locations",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Locations_FileId",
                table: "Locations",
                column: "FileId");

            migrationBuilder.AddForeignKey(
                name: "FK_Locations_Files_FileId",
                table: "Locations",
                column: "FileId",
                principalTable: "Files",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Locations_Files_FileId",
                table: "Locations");

            migrationBuilder.DropIndex(
                name: "IX_Locations_FileId",
                table: "Locations");

            migrationBuilder.DropColumn(
                name: "FileId",
                table: "Locations");
        }
    }
}
