using BGE.Engine.DTO;

namespace BGE.Engine.Game
{
	public interface IGame
	{
		PlayerState StartGame(int rows = Constants.DefaultRows, int cols = Constants.DefaultCols);
		ShootResponse Shoot(ShootRequest shootRequest, PlayerState playerState);
		PlayerState Cleanse(PlayerState playerState);
	}
}