using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using RentACar.Domain.Entities;
using System.Globalization;

namespace RentACar.Application.Common.Helpers
{
    public class InvoiceDocument(Invoice model, Person person) : IDocument
    {
        private static readonly CultureInfo EuroCulture = new("en-US")
        {
            NumberFormat = { CurrencySymbol = "€" }
        };

        private const decimal DefaultVatRate = 0.25m;

        public Invoice Model { get; } = model;

        public Person Person { get; } = person;

        public DocumentMetadata GetMetadata() =>
            new()
            { Title = $"Invoice #{Model?.InvoiceNumber ?? "—"}" };

        public void Compose(IDocumentContainer container)
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(40);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(11));

                page.Header().Element(ComposeHeader);
                page.Content().Element(ComposeContent);
                page.Footer().Element(footer =>
                {
                    footer.AlignCenter().Text(text =>
                    {
                        text.Span("Page ").SemiBold();
                        text.CurrentPageNumber();
                        text.Span(" / ");
                        text.TotalPages();
                    });
                });
            });
        }

        void ComposeHeader(IContainer container)
        {
            container.Row(row =>
            {
                row.RelativeItem().Column(col =>
                {
                    col.Item().AlignLeft().Text("CARcarAPP").SemiBold().FontSize(18).FontColor(Colors.Blue.Medium);
                    col.Item().PaddingTop(6).Text("Ulica kralja Tomislava 8\n" +
                                                  "31400 Đakovo, Croatia\n" +
                                                  "CARcarAPP@gmail.com\n" +
                                                  "(031) 456 789"
                    ).FontSize(9).FontColor(Colors.Grey.Darken1);
                });

                row.ConstantItem(220).Column(col =>
                {
                    col.Item().AlignRight().Text("INVOICE").SemiBold().FontSize(22).FontColor(Colors.Blue.Medium);
                    col.Item().PaddingTop(8).Text($"Invoice #: {Model?.InvoiceNumber ?? "—"}\nIssue date: {Model?.IssuedAt:d}")
                   .AlignRight().FontSize(10);
                });
            });
        }

        void ComposeContent(IContainer container)
        {
            container.PaddingVertical(10).Column(column =>
            {
                column.Spacing(12);

                column.Item().Row(row =>
                {
                    row.RelativeItem().Element(c =>
                    {
                        c.Column(col =>
                        {
                            col.Item().Text("Bill from").SemiBold();
                            col.Item().PaddingTop(4).Text("CARcarAPP");
                            col.Item().Text("Ulica kralja Tomislava 8");
                            col.Item().Text("31400 Đakovo, Croatia");
                            col.Item().Text("(031) 456 789");
                            col.Item().Text("CARcarAPP@gmail.com");
                        });
                    });

                    row.ConstantItem(220);

                    row.RelativeItem().Element(c =>
                    {
                        c.Column(col =>
                        {
                            col.Item().Text("Bill to").SemiBold();

                            var customerName = Person != null
                                ? $"{Person.FirstName ?? string.Empty} {Person.LastName ?? string.Empty}".Trim()
                                : "Customer";

                            col.Item().PaddingTop(4).Text(customerName);

                            if (!string.IsNullOrWhiteSpace(Person?.Email))
                                col.Item().Text(Person.Email);

                            if (!string.IsNullOrWhiteSpace(Person?.PhoneNumber))
                                col.Item().Text(Person.PhoneNumber);
                        });
                    });
                });

                column.Item().Element(ComposeItemsTable);

                column.Item().PaddingTop(50).Row(row =>
                {
                    row.RelativeItem().Column(col =>
                    {
                        col.Item().Text("Payment details").SemiBold();
                        col.Item().PaddingTop(6).Text("Bank: Example Bank d.d.\n" + 
                                                      "IBAN: HR12 3456 7890 1234 5678 9\n" + 
                                                      "SWIFT/BIC: EXAMPLHR"
                        ).FontSize(10);

                        if (!string.IsNullOrWhiteSpace(Model?.Reservation?.Notes))
                        {
                            col.Item().PaddingTop(12).Text("Notes").SemiBold();
                            col.Item().Text(Model.Reservation.Notes).FontSize(9);
                        }
                    });

                    row.ConstantItem(220).Element(c =>
                    {
                        var (subtotal, vatTotal, grandTotal) = CalculateTotals();

                        c.Column(col =>
                        {
                            col.Item().AlignRight().Row(r =>
                            {
                                r.RelativeItem().Text("Subtotal:").SemiBold();
                                r.ConstantItem(110).AlignRight().Text(subtotal.ToString("C", EuroCulture));
                            });

                            col.Item().AlignRight().Row(r =>
                            {
                                r.RelativeItem().Text($"VAT ({GetVatPercent():0.#}%):").SemiBold();
                                r.ConstantItem(110).AlignRight().Text(vatTotal.ToString("C", EuroCulture));
                            });

                            col.Item().PaddingTop(6).AlignRight().Row(r =>
                            {
                                r.RelativeItem().Text("Total: ").SemiBold();
                                r.ConstantItem(110).AlignRight().Text(grandTotal.ToString("C", EuroCulture)).FontSize(14).SemiBold();
                            });
                        });
                    });
                });
            });
        }

        void ComposeItemsTable(IContainer container)
        {
            var headerStyle = TextStyle.Default.SemiBold();

            container.Table(table =>
            {
                table.ColumnsDefinition(columns =>
                {
                    columns.RelativeColumn(4);
                    columns.RelativeColumn();  
                    columns.RelativeColumn();  
                    columns.RelativeColumn();
                    columns.RelativeColumn();
                });

                table.Header(header =>
                {
                    header.Cell().PaddingTop(50).Element(CellHeader).Text("Description").Style(headerStyle);
                    header.Cell().PaddingTop(50).AlignRight().Element(CellHeader).Text("Unit Price").Style(headerStyle);
                    header.Cell().PaddingTop(50).AlignRight().Element(CellHeader).Text("Qty").Style(headerStyle);
                    header.Cell().PaddingTop(50).AlignRight().Element(CellHeader).Text("VAT").Style(headerStyle);
                    header.Cell().PaddingTop(50).AlignRight().Element(CellHeader).Text("Line Total").Style(headerStyle);

                    header.Cell().ColumnSpan(5).PaddingTop(6).BorderBottom(1).BorderColor(Colors.Grey.Lighten2);
                });

                if (Model?.Reservation != null)
                {
                    var reservation = Model.Reservation;
                    var days = Math.Max(1, (reservation.EndDateTime - reservation.StartDateTime).Days) + 1;
                    var vatRate = DefaultVatRate;

                    if (reservation.Vehicle != null)
                    {
                        var vehicleName = BuildVehicleName(reservation.Vehicle);

                        var unitPrice = reservation.Vehicle.Price / 1.25m;
                        var qty = days;
                        var lineTotal = unitPrice * 1.25m * qty;
                        AppendItemRow(table, vehicleName, unitPrice, qty, vatRate, lineTotal);
                    }

                    if (reservation.ExtraServices != null && reservation.ExtraServices.Count != 0)
                    {
                        foreach (var service in reservation.ExtraServices)
                        {
                            var unitPrice = service.Price / 1.25m;
                            var qty = days;
                            var lineTotal = unitPrice * 1.25m * qty;
                            AppendItemRow(table, service.Name, unitPrice, qty, vatRate, lineTotal);
                        }
                    }
                }
                else
                {
                    table.Cell().ColumnSpan(5).Element(CellStyle).Text("No items").Italic();
                }

                static IContainer CellHeader(IContainer c) =>
                    c.PaddingBottom(6);

                static IContainer CellStyle(IContainer c) =>
                    c.BorderBottom(1).BorderColor(Colors.Grey.Lighten2).PaddingVertical(6);

                static void AppendItemRow(TableDescriptor tableRef, string description, decimal unitPrice, decimal qty, decimal vatRateLocal, decimal lineTotal)
                {
                    tableRef.Cell().Element(CellStyle).Text(description);
                    tableRef.Cell().Element(CellStyle).AlignRight().Text(unitPrice.ToString("C", EuroCulture));
                    tableRef.Cell().Element(CellStyle).AlignRight().Text(qty.ToString("0") + " days");
                    tableRef.Cell().Element(CellStyle).AlignRight().Text($"{vatRateLocal:P0}");
                    tableRef.Cell().Element(CellStyle).AlignRight().Text(lineTotal.ToString("C", EuroCulture));
                }
            });
        }

        (decimal subtotal, decimal vatTotal, decimal grandTotal) CalculateTotals()
        {
            decimal subtotal = 0m;
            decimal vatRate = DefaultVatRate;

            if (Model?.Reservation != null)
            {
                var r = Model.Reservation;
                var days = Math.Max(1, (r.EndDateTime - r.StartDateTime).Days) + 1;

                if (r.Vehicle != null)
                {
                    subtotal += r.Vehicle.Price / 1.25m * days;
                }

                if (r.ExtraServices != null && r.ExtraServices.Count != 0)
                {
                    subtotal += r.ExtraServices.Sum(s => s.Price / 1.25m * days);
                }
            }

            var vatTotal = Math.Round(subtotal * vatRate, 2);
            var grandTotal = subtotal + vatTotal;

            return (subtotal, vatTotal, grandTotal);
        }

        static decimal GetVatPercent() => DefaultVatRate * 100m;

        static string BuildVehicleName(Vehicle vehicle)
        {
            var brand = vehicle?.Model?.Brand?.Name ?? string.Empty;
            var model = vehicle?.Model?.Name ?? string.Empty;
            var plate = !string.IsNullOrWhiteSpace(vehicle?.LicensePlate) ? $" ({vehicle.LicensePlate})" : "";
            var name = $"{brand} {model}".Trim();
            return string.IsNullOrWhiteSpace(name) ? "Vehicle" + plate : name + plate;
        }
    }
}
