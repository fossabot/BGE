using BGE.Engine.SignalR;

namespace BGE.Engine.Game
{
	public interface IGame
	{
		GameState StartGame(int rows = 8, int cols = 8);
		ShootResponse Shoot(ShootRequest shootRequest, GameState gameState);
		PlayerState Cleanse(PlayerState playerState);
		string GameStats();
	}
}