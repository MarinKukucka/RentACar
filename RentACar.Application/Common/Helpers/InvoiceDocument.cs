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

                if(Model.Reservation != null && Model.Reservation.ExtraServices != null)
                {
                    var totalPrice = Model.Reservation.ExtraServices.Sum(x => x.Price);
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
                    columns.ConstantColumn(25);
                    columns.RelativeColumn(3);
                    columns.RelativeColumn();
                    columns.RelativeColumn();
                    columns.RelativeColumn();
                });

                table.Header(header =>
                {
                    header.Cell().Text("#");
                    header.Cell().Text("Product").Style(headerStyle);
                    header.Cell().AlignRight().Text("Unit price").Style(headerStyle);
                    header.Cell().AlignRight().Text("Quantity").Style(headerStyle);
                    header.Cell().AlignRight().Text("Total").Style(headerStyle);

                    header.Cell().ColumnSpan(5).PaddingTop(5).BorderBottom(1).BorderColor(Colors.Black);
                });

                if (Model.Reservation != null && Model.Reservation.ExtraServices != null)
                {
                    foreach (var item in Model.Reservation.ExtraServices)
                    {
                        var index = Model.Reservation.ExtraServices.IndexOf(item) + 1;

                        table.Cell().Element(CellStyle).Text($"{index}");
                        table.Cell().Element(CellStyle).Text(item.Name);
                        table.Cell().Element(CellStyle).AlignRight().Text($"{item.Price:C}");

                        static IContainer CellStyle(IContainer container) => container.BorderBottom(1).BorderColor(Colors.Grey.Lighten2).PaddingVertical(5);
                    }
                }
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
