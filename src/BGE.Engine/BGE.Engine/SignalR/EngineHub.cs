using System.Threading.Tasks;
using BGE.Engine.Game;
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
		
		[HubMethodName("ShootMarker")]
		public Task ShootMarker(string userId)
        {
            return Clients.User(userId).SendAsync("Shot");
        }
		
		[HubMethodName("AcceptMarker")]
		public Task AcceptMarker(string userId)
        {
            return Clients.User(userId).SendAsync("Accepted");
        }
		
		[HubMethodName("Cleanse")]
		public Task<PlayerState> Cleanse(PlayerState playerState)
		{
			return Task.FromResult(_game.Cleanse(playerState));
		}

		[HubMethodName("StartGame")]
		public async Task<PlayerState> StartGame(StartRequest startRequest)
        {
            await startRequest.ValidateAndThrowAsync();
			return _game.StartGame(startRequest.Rows, startRequest.Cols);
		}
		
		[HubMethodName("Shoot")]
		public async Task<ShootResponse> Shoot(ShootRequest shootRequest, PlayerState playerState)
        {
            await shootRequest.ValidateAndThrowAsync(playerState);
			return _game.Shoot(shootRequest, playerState);
		}
	}
}