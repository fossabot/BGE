namespace BGE.Engine.Game
{
	public interface IGame
	{
		GameState StartGame();
		string Shoot();
		string GameStats();
	}
}