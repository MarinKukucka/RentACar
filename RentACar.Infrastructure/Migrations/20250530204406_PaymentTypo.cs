using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RentACar.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class PaymentTypo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InvoicePayment_payments_PaymentsId",
                table: "InvoicePayment");

            migrationBuilder.DropForeignKey(
                name: "FK_payments_People_PersonId",
                table: "payments");

            migrationBuilder.DropForeignKey(
                name: "FK_payments_Rentals_RentalId",
                table: "payments");

            migrationBuilder.DropForeignKey(
                name: "FK_payments_Reservations_ReservationId",
                table: "payments");

            migrationBuilder.DropPrimaryKey(
                name: "PK_payments",
                table: "payments");

            migrationBuilder.RenameTable(
                name: "payments",
                newName: "Payments");

            migrationBuilder.RenameIndex(
                name: "IX_payments_ReservationId",
                table: "Payments",
                newName: "IX_Payments_ReservationId");

            migrationBuilder.RenameIndex(
                name: "IX_payments_RentalId",
                table: "Payments",
                newName: "IX_Payments_RentalId");

            migrationBuilder.RenameIndex(
                name: "IX_payments_PersonId",
                table: "Payments",
                newName: "IX_Payments_PersonId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Payments",
                table: "Payments",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_InvoicePayment_Payments_PaymentsId",
                table: "InvoicePayment",
                column: "PaymentsId",
                principalTable: "Payments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_People_PersonId",
                table: "Payments",
                column: "PersonId",
                principalTable: "People",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_Rentals_RentalId",
                table: "Payments",
                column: "RentalId",
                principalTable: "Rentals",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_Reservations_ReservationId",
                table: "Payments",
                column: "ReservationId",
                principalTable: "Reservations",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InvoicePayment_Payments_PaymentsId",
                table: "InvoicePayment");

            migrationBuilder.DropForeignKey(
                name: "FK_Payments_People_PersonId",
                table: "Payments");

            migrationBuilder.DropForeignKey(
                name: "FK_Payments_Rentals_RentalId",
                table: "Payments");

            migrationBuilder.DropForeignKey(
                name: "FK_Payments_Reservations_ReservationId",
                table: "Payments");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Payments",
                table: "Payments");

            migrationBuilder.RenameTable(
                name: "Payments",
                newName: "payments");

            migrationBuilder.RenameIndex(
                name: "IX_Payments_ReservationId",
                table: "payments",
                newName: "IX_payments_ReservationId");

            migrationBuilder.RenameIndex(
                name: "IX_Payments_RentalId",
                table: "payments",
                newName: "IX_payments_RentalId");

            migrationBuilder.RenameIndex(
                name: "IX_Payments_PersonId",
                table: "payments",
                newName: "IX_payments_PersonId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_payments",
                table: "payments",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_InvoicePayment_payments_PaymentsId",
                table: "InvoicePayment",
                column: "PaymentsId",
                principalTable: "payments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_payments_People_PersonId",
                table: "payments",
                column: "PersonId",
                principalTable: "People",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_payments_Rentals_RentalId",
                table: "payments",
                column: "RentalId",
                principalTable: "Rentals",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_payments_Reservations_ReservationId",
                table: "payments",
                column: "ReservationId",
                principalTable: "Reservations",
                principalColumn: "Id");
        }
    }
}
