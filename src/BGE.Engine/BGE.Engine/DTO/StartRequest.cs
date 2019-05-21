using System.Threading.Tasks;
using FluentValidation;

namespace BGE.Engine.DTO
{
	public class StartRequest
	{
		public int Cols { get; set; }
		public int Rows { get; set; }
	}

    public static class StartRequestExtensions
    {
        public static Task ValidateAndThrowAsync(this StartRequest startRequest)
        {
            var validator = new StartRequestValidator();
            return validator.ValidateAndThrowAsync(startRequest);
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