using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RentACar.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveUnusedPropertiesInInvoice : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Invoices_People_PersonId",
                table: "Invoices");

            migrationBuilder.DropForeignKey(
                name: "FK_Invoices_Rentals_RentalId",
                table: "Invoices");

            migrationBuilder.DropIndex(
                name: "IX_Invoices_PersonId",
                table: "Invoices");

            migrationBuilder.DropIndex(
                name: "IX_Invoices_RentalId",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "PersonId",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "RentalId",
                table: "Invoices");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PersonId",
                table: "Invoices",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RentalId",
                table: "Invoices",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Invoices_PersonId",
                table: "Invoices",
                column: "PersonId");

            migrationBuilder.CreateIndex(
                name: "IX_Invoices_RentalId",
                table: "Invoices",
                column: "RentalId");

            migrationBuilder.AddForeignKey(
                name: "FK_Invoices_People_PersonId",
                table: "Invoices",
                column: "PersonId",
                principalTable: "People",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Invoices_Rentals_RentalId",
                table: "Invoices",
                column: "RentalId",
                principalTable: "Rentals",
                principalColumn: "Id");
        }
    }
}
