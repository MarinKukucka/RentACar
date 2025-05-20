namespace RentACar.Domain.Constants
{
    public abstract class Roles
    {
        public const string Admin = nameof(Admin);

        public const string Agent = nameof(Agent);

        public static IEnumerable<string> All =>
        [
            Admin, Agent
        ];
    }
}
