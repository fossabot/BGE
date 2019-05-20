using BGE.Engine.SignalR;

namespace BGE.Engine.Game
{
	public interface IGame
	{
		PlayerState StartGame(int rows = 8, int cols = 8);
		ShootResponse Shoot(ShootRequest shootRequest, PlayerState playerState);
		PlayerState Cleanse(PlayerState playerState);
		string GameStats();
	}
}