using System;
using System.Linq;
using BGE.Engine.SignalR;

namespace BGE.Engine.Game
{
	public class Game : IGame
	{
		private readonly Random _random;
		public Game()
		{
			_random = new Random();
		}
		
		public GameState StartGame(int rows = 8, int cols = 8)
		{
			var playerState = new PlayerState
			{
				Field = GenerateRandomField(rows, cols)
			};

			var gameState = new GameState
			{
				PlayerState = playerState
			};
			
			return gameState;
		}

		private char[,] GenerateRandomField(int rows, int cols)
		{
			var field = new char[rows, cols];

			for (var i = 0; i < rows; i++)
			{
				for (var j = 0; j < cols; j++)
				{
					field[i, j] = ' ';
				}
			}
			
			Generate(field, 2);
			Generate(field, 3);
			Generate(field, 4);
			
			return field;
		}

		private void Generate(char[,] field, int ship)
		{
			var rows = field.GetUpperBound(0) + 1;
			var cols = field.GetUpperBound(1) + 1;
			while (true)
			{
				var x = _random.Next(0, rows);
				var y = _random.Next(0, cols);
				var isVertical = _random.Next(0, 2) == 1;
				
				if(isVertical && y > cols - ship)
					continue;
				
				if(!isVertical && x > rows - ship)
					continue;

				if (isVertical)
				{
					var overlap = Enumerable.Range(y, ship)
						.Select(r => field[x, r] != ' ').Any(r => r);
					
					if(overlap)
						continue;
				}
				else
				{
					var overlap = Enumerable.Range(x, ship)
						.Select(r => field[r, y] != ' ').Any(r => r);
					
					if(overlap)
						continue;
				}
				
				for (var i = 0; i < ship; i++)
				{
					if (isVertical)
						field[x, y + i] = '0';
					else
						field[x + i, y] = '0';
				}
				break;
			}
		}

		public GameState Shoot(ShootRequest shootRequest, GameState gameState)
		{
			gameState.PlayerState.Field[shootRequest.X - 1, shootRequest.Y - 1] = 'X';
			return gameState;
		}

		public string GameStats()
		{
			throw new NotImplementedException();
		}
	}
}