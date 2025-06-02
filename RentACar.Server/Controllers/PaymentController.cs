using Microsoft.AspNetCore.Mvc;
using RentACar.Application.Payments.Commands.CreatePayment;
using Stripe;

namespace RentACar.Server.Controllers
{
    public class PaymentController(IMediator mediator) : ApiController
    {
        [HttpPost("create-payment-intent")]
        [ProducesResponseType(typeof(PaymentIntentResponse), StatusCodes.Status200OK)]
        public ActionResult<PaymentIntentResponse> CreatePaymentIntent([FromBody] PaymentIntentRequest request)
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = (long?)(request.Amount * 100),
                Currency = "eur",
                AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
                {
                    Enabled = true,
                },
            };

            var service = new PaymentIntentService();
            var paymentIntent = service.Create(options);

            return Ok(new PaymentIntentResponse
            { 
                ClientSecret = paymentIntent.ClientSecret,
                PaymentIntentId = paymentIntent.Id
            });
        }

        [HttpPost("create-payment")]
        [ProducesResponseType(typeof(NewPaymentResponse), StatusCodes.Status200OK)]
        public async Task<NewPaymentResponse> CreatePayment([FromBody] CreatePaymentCommand command)
        {
            return await mediator.Send(command);
        }
    }

    public class PaymentIntentRequest
    {
        public decimal Amount { get; set; }
    }

    public class PaymentIntentResponse
    {
        public string? ClientSecret { get; set; }

        public string? PaymentIntentId { get; set; }
    }
}
