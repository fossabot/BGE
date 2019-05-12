using BGE.Engine.SignalR;

namespace BGE.Engine.Game
{
	public interface IGame
	{
		GameState StartGame(int rows = 8, int cols = 8);
		GameState Shoot(ShootRequest shootRequest, GameState gameState);
		string GameStats();
	}
}