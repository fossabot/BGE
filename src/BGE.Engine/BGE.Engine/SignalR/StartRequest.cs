using System.Collections.Generic;
using System.Threading.Tasks;
using BGE.Engine.Game;
using FluentValidation;

namespace BGE.Engine.SignalR
{
	public class StartRequest
	{
		public int Cols { get; set; }
		public int Rows { get; set; }
	}

    public static class StartRequestExtensions
    {
        public static async Task ValidateAndThrowAsync(this StartRequest startRequest)
        {
            var context = new ValidationContext<ShootRequest>(shootRequest);
            context.RootContextData.Add(new KeyValuePair<string, object>("playerState", playerState));
            var validator = new ShootRequestValidator();
            var result = await validator.ValidateAsync(context);

            if (!result.IsValid)
                throw new ValidationException(result.Errors);
        }
    }

	public class StartRequestValidator : AbstractValidator<StartRequest>
	{
		public StartRequestValidator()
		{
			RuleFor(r => r.Cols).InclusiveBetween(6, 15);
			RuleFor(r => r.Rows).InclusiveBetween(6, 15);
		}
	}
}