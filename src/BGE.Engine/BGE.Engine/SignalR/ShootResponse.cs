using BGE.Engine.Game;

namespace BGE.Engine.SignalR
{
	public class ShootResponse
	{
		public bool Hit { get; set; }
		public GameState GameState { get; set; }
	}
}