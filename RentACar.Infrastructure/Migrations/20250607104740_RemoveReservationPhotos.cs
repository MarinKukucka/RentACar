using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RentACar.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveReservationPhotos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ReservationPhotos");

            migrationBuilder.RenameColumn(
                name: "ReservationPhotoType",
                table: "RentalPhotos",
                newName: "RentalPhotoType");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "RentalPhotoType",
                table: "RentalPhotos",
                newName: "ReservationPhotoType");

            migrationBuilder.CreateTable(
                name: "ReservationPhotos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FileId = table.Column<int>(type: "int", nullable: true),
                    ReservationId = table.Column<int>(type: "int", nullable: true),
                    ReservationPhotoType = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReservationPhotos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ReservationPhotos_Files_FileId",
                        column: x => x.FileId,
                        principalTable: "Files",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ReservationPhotos_Reservations_ReservationId",
                        column: x => x.ReservationId,
                        principalTable: "Reservations",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_ReservationPhotos_FileId",
                table: "ReservationPhotos",
                column: "FileId");

            migrationBuilder.CreateIndex(
                name: "IX_ReservationPhotos_ReservationId",
                table: "ReservationPhotos",
                column: "ReservationId");
        }
    }
}
