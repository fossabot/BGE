using System.Collections.Generic;
using System.Threading.Tasks;
using BGE.Engine.Game;
using FluentValidation;
using Microsoft.AspNetCore.SignalR;

namespace BGE.Engine.SignalR
{
	public class EngineHub : Hub
	{
		private readonly IGame _game;
		
		public EngineHub(IGame game)
		{
			_game = game;
		}
		
		[HubMethodName("StartGame")]
		public async Task<GameState> StartGame(StartRequest startRequest)
		{
			var validator = new StartRequestValidator();
			await validator.ValidateAndThrowAsync(startRequest);
			return _game.StartGame(startRequest.Rows, startRequest.Cols);
		}
		
		[HubMethodName("Shoot")]
		public async Task<GameState> Shoot(ShootRequest shootRequest, GameState gameState)
		{
			var context = new ValidationContext<ShootRequest>(shootRequest);
			context.RootContextData.Add(new KeyValuePair<string, object>("gameState", gameState));
			var validator = new ShootRequestValidator();
			var result = await validator.ValidateAsync(context);
			
			if(!result.IsValid)
				throw new ValidationException(result.Errors);
			
			return _game.Shoot(shootRequest, gameState);
		}
	}
}