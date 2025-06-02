using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using RentACar.Domain.Entities;

namespace RentACar.Application.Common.Helpers
{
    public class InvoiceDocument(Invoice model) : IDocument
    {
        public Invoice Model { get; } = model;

        public DocumentMetadata GetMetadata() => DocumentMetadata.Default;

        public void Compose(IDocumentContainer container)
        {
            container
                .Page(page =>
                {
                    page.Margin(50);

                    page.Header().Element(ComposeHeader);
                    page.Content().Element(ComposeContent);

                    page.Footer().AlignCenter().Text(text =>
                    {
                        text.CurrentPageNumber();
                        text.Span(" / ");
                        text.TotalPages();
                    });
                });
        }

        void ComposeHeader(IContainer container)
        {
            container.Row(row =>
            {
                row.RelativeItem().Column(column =>
                {
                    column
                        .Item().Text($"Invoice #{Model.InvoiceNumber}")
                        .FontSize(20).SemiBold().FontColor(Colors.Blue.Medium);

                    column.Item().Text(text =>
                    {
                        text.Span("Issue date: ").SemiBold();
                        text.Span($"{Model.IssuedAt:d}");
                    });
                });
            });
        }

        void ComposeContent(IContainer container)
        {
            container.PaddingVertical(40).Column(column =>
            {
                column.Spacing(20);

                column.Item().Element(ComposeTable);

                if(Model.Reservation != null)
                {
                    var totalPrice = Model.Reservation.TotalPrice;
                    column.Item().PaddingRight(5).AlignRight().Text($"Grand total: {totalPrice:C}").SemiBold();
                }

                if (Model.Reservation != null && !string.IsNullOrWhiteSpace(Model.Reservation.Notes))
                    column.Item().PaddingTop(25).Element(ComposeComments);
            });
        }

        void ComposeTable(IContainer container)
        {
            var headerStyle = TextStyle.Default.SemiBold();

            container.Table(table =>
            {
                table.ColumnsDefinition(columns =>
                {
                    columns.RelativeColumn(3);  // Service name
                    columns.RelativeColumn();   // Unit price
                    columns.RelativeColumn();   // Days
                    columns.RelativeColumn();   // Total
                });

                // Table header
                table.Header(header =>
                {
                    header.Cell().Text("Service").Style(headerStyle);
                    header.Cell().AlignRight().Text("Unit Price").Style(headerStyle);
                    header.Cell().AlignRight().Text("Days").Style(headerStyle);
                    header.Cell().AlignRight().Text("Total").Style(headerStyle);

                    header.Cell().ColumnSpan(4).PaddingTop(5).BorderBottom(1).BorderColor(Colors.Black);
                });

                if (Model.Reservation is not null)
                {
                    var reservation = Model.Reservation;
                    var days = (reservation.EndDateTime - reservation.StartDateTime).Days;

                    // 🚗 Vehicle row
                    if (reservation.Vehicle != null && reservation.Vehicle.Model != null && reservation.Vehicle.Model.Brand != null)
                    {
                        var vehicleName = $"{reservation.Vehicle.Model.Brand.Name} {reservation.Vehicle.Model.Name}";
                        var vehiclePrice = reservation.Vehicle.Price;

                        table.Cell().Element(CellStyle).Text(vehicleName);
                        table.Cell().Element(CellStyle).AlignRight().Text($"{vehiclePrice:C}");
                        table.Cell().Element(CellStyle).AlignRight().Text($"{days}");
                        table.Cell().Element(CellStyle).AlignRight().Text($"{(vehiclePrice * days):C}");
                    }

                    // 🛠️ Extra services
                    if (reservation.ExtraServices != null)
                    {
                        foreach (var service in reservation.ExtraServices)
                        {
                            table.Cell().Element(CellStyle).Text(service.Name);
                            table.Cell().Element(CellStyle).AlignRight().Text($"{service.Price:C}");
                            table.Cell().Element(CellStyle).AlignRight().Text($"{days}");
                            table.Cell().Element(CellStyle).AlignRight().Text($"{(service.Price * days):C}");
                        }
                    }
                }

                static IContainer CellStyle(IContainer container) =>
                    container.BorderBottom(1).BorderColor(Colors.Grey.Lighten2).PaddingVertical(5);
            });
        }


        void ComposeComments(IContainer container)
        {
            container.ShowEntire().Background(Colors.Grey.Lighten3).Padding(10).Column(column =>
            {
                column.Spacing(5);
                column.Item().Text("Comments").FontSize(14).SemiBold();
                column.Item().Text(Model.Reservation != null ? Model.Reservation.Notes : "");
            });
        }
    }

    public class AddressComponent(string title) : IComponent
    {
        public void Compose(IContainer container)
        {
            container.ShowEntire().Column(column =>
            {
                column.Spacing(2);

                column.Item().Text(title).SemiBold();
                column.Item().PaddingBottom(5).LineHorizontal(1);

                column.Item().Text("CARcarAPP");
                column.Item().Text("Mjau ulica 8");
                column.Item().Text("31400 Đakovo");
                column.Item().Text("RentACar@gmail.com");
                column.Item().Text("1234567890");
            });
        }
    }
}
