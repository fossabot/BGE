using System.Threading.Tasks;

namespace BGE.Engine.SignalR
{
	public interface IEngineClient
	{
		Task StartGame();
		Task Shoot();
		Task GameStats();
	}
}