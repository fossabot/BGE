using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace BGE.Engine.SignalR
{
	public class GameStats
	{
		public bool[,] PlayerField { get; set; }
		public bool[,] NewField { get; set; }
		public int Num { get; set; }
	}

	public class Shot
	{
		public int X { get; set; }
		public int Y { get; set; }
		public string Player { get; set; }
	}
	
	public class EngineHub : Hub<IEngineClient>
	{
		[HubMethodName("StartGame")]
		public Task<GameStats> Start()
		{
			var s = new GameStats
			{
				Num = 1,
				NewField = new[,]
				{
					{
						true, true
					},
					{
						false, false
					}
				},
				PlayerField = new[,]
				{
					{
						true, true
					},
					{
						false, false
					}
				}
			};
			return Task.FromResult(s);
		}

		
		
		[HubMethodName("Shoot")]
		public Task<string> Shoot(Shot state)
		{
			Console.WriteLine("Hello");
			return Task.FromResult("ok");
		}
		
		[HubMethodName("Send")]
		public Task<string> DirectMessage(string state)
		{
			Console.WriteLine("Hello");
			return Task.FromResult(state);
		}
	}
}