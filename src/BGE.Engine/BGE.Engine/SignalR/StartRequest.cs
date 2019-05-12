using FluentValidation;

namespace BGE.Engine.SignalR
{
	public class StartRequest
	{
		public int Cols { get; set; }
		public int Rows { get; set; }
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