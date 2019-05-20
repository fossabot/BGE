using BGE.Engine.Game;

namespace BGE.Engine.SignalR
{
	public class ShootResponse
	{
		public bool Hit { get; set; }
		public PlayerState PlayerState { get; set; }
	}
}