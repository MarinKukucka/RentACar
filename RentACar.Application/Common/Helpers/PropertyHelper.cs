namespace RentACar.Application.Common.Helpers
{
    public static class PropertyHelper
    {
        public static string GetPredicate(string synonym)
        {
            return synonym.ToLower() switch
            {
                "salesmanager_fullname" => $"SalesManager.Person.FirstName + \" \" + SalesManager.Person.LastName",
                _ => synonym.Replace('_', '.'),
            };
        }
    }
}
