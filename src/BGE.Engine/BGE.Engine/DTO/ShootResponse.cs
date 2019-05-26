using BGE.Engine.Game;

namespace BGE.Engine.DTO
{
	public class ShootResponse
	{
		public bool IsHit { get; set; }
		public bool IsWinner { get; set; }
		public PlayerState PlayerState { get; set; }
	}
}