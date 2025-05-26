﻿namespace RentACar.Application.Locations.Dtos
{
    public class LocationDto
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Address { get; set; } = string.Empty;

        public string PhoneNumber { get; set; } = string.Empty;

        public string City { get; set; } = string.Empty;
    }
}
