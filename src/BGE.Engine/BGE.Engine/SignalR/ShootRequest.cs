using System.Threading;
using System.Threading.Tasks;
using BGE.Engine.Game;
using FluentValidation;
using FluentValidation.Results;

namespace BGE.Engine.SignalR
{
	public class ShootRequest
	{
		public int X { get; set; }
		public int Y { get; set; }
	}

	public class ShootRequestValidator : AbstractValidator<ShootRequest>
	{
		public override async Task<ValidationResult> ValidateAsync(ValidationContext<ShootRequest> context, CancellationToken cancellation = new CancellationToken())
		{
			var result = await base.ValidateAsync(context, cancellation);
			if (!(context.RootContextData["playerState"] is PlayerState playerState))
			{
				result.Errors.Add(new ValidationFailure("PlayerState", "No player state is supplied!"));
				return result;
			}

			var shootRequest = context.InstanceToValidate;
			if (!IsValid(shootRequest.X, playerState, 0))
				result.Errors.Add(new ValidationFailure("X", "Wrong X!", shootRequest.X));
			
			if (!IsValid(shootRequest.Y, playerState, 1))
				result.Errors.Add(new ValidationFailure("Y", "Wrong Y!", shootRequest.Y));
			
			if(playerState.Field[shootRequest.X - 1, shootRequest.Y - 1] == 'X')
				result.Errors.Add(new ValidationFailure("XY","Invalid cell!"));

			return result;
		}
		
		private static bool IsValid(int value, PlayerState playerState, int dimension)
		{
			var field = playerState.Field;
			var max = field.GetUpperBound(dimension) + 1;
			return 1 <= value && value <= max;
		}
	}
}