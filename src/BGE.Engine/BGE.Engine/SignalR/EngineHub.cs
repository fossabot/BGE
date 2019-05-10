using System;
using System.Threading.Tasks;
using BGE.Engine.Game;
using Microsoft.AspNetCore.SignalR;

namespace BGE.Engine.SignalR
{
	public class Shot
	{
		public int X { get; set; }
		public int Y { get; set; }
		public string Player { get; set; }
	}
	
	public class EngineHub : Hub
	{
		private readonly IGame _game;
		
		public EngineHub(IGame game)
		{
			_game = game;
		}
		
		[HubMethodName("StartGame")]
		public Task<GameState> StartGame()
		{
			var gameState = _game.StartGame();
			return Task.FromResult(gameState);
		}
		
		[HubMethodName("Shoot")]
		public Task<string> Shoot(Shot state)
		{
			Console.WriteLine("Hello");
			return Task.FromResult("ok");
		}
	}
}