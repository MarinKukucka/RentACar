﻿using RentACar.Domain.Enums;

namespace RentACar.Application.Reservations.Dtos
{
    public class ReservationDto
    {
        public int Id { get; set; }

        public required DateTime StartDateTime { get; set; }

        public required DateTime EndDateTime { get; set; }

        public required ReservationStatus Status { get; set; }

        public DateTime? ConfirmedAt { get; set; }

        public DateTime? CancelledAt { get; set; }

        public required decimal TotalPrice { get; set; }

        public string? Notes { get; set; }

        public required string PersonName { get; set; }

        public List<string>? ExtraServices { get; set; }
    }
}
