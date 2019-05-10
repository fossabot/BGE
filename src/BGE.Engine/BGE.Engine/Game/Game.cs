using System;
using System.Linq;

namespace BGE.Engine.Game
{
	public class Game : IGame
	{
		private readonly Random _random;
		public Game()
		{
			_random = new Random();
		}
		
		public string StartGame()
		{
			var field = GenerateRandomField();
			return "a";
		}

		private bool[,] GenerateRandomField()
		{
			var field = new bool[8, 8];
			
			Generate(field, 2);
			Generate(field, 3);
			Generate(field, 3);
			Generate(field, 4);
			Generate(field, 5);
			
			return field;
		}

		private void Generate(bool[,] field, int ship)
		{
			while (true)
			{
				var x = _random.Next(0, 8);
				var y = _random.Next(0, 8);
				var isVertical = _random.Next(0, 2) == 1;
				
				if(isVertical && y > 8 - ship)
					continue;
				
				if(!isVertical && x > 8 - ship)
					continue;

				if (isVertical)
				{
					var overlap = Enumerable.Range(y, ship).Select(r => field[x, r]).Any(r => r);
					if(overlap)
						continue;
				}
				else
				{
					var overlap = Enumerable.Range(x, ship).Select(r => field[r, y]).Any(r => r);
					if(overlap)
						continue;
				}
				
				for (var i = 0; i < ship; i++)
				{
					if (isVertical)
						field[x, y + i] = true;
					else
						field[x + i, y] = true;
				}
				break;
			}
		}

		public string Shoot()
		{
			
			throw new NotImplementedException();
		}

		public string GameStats()
		{
			throw new NotImplementedException();
		}
	}
}