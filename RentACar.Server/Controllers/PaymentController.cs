using Microsoft.AspNetCore.Mvc;
using Stripe;

namespace RentACar.Server.Controllers
{
    public class PaymentController : ApiController
    {
        [HttpPost("create-payment-intent")]
        [ProducesResponseType(typeof(PaymentResponse), StatusCodes.Status200OK)]
        public ActionResult<PaymentResponse> CreatePaymentIntent([FromBody] PaymentRequest request)
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = request.Amount,
                Currency = "eur",
                AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
                {
                    Enabled = true,
                },
            };

            var service = new PaymentIntentService();
            var paymentIntent = service.Create(options);

            return Ok(new PaymentResponse { 
                ClientSecret = paymentIntent.ClientSecret 
            });
        }
    }

    public class PaymentRequest
    {
        public long Amount { get; set; }
    }

    public class PaymentResponse
    {
        public string? ClientSecret { get; set; }
    }
}
