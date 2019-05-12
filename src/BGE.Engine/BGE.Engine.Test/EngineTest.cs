using System;
using BGE.Engine.Game;
using BGE.Engine.SignalR;
using FluentAssertions;
using Xunit;
using Xunit.Abstractions;
using Xunit.Sdk;

namespace BGE.Engine.Test
{
	public class EngineTest
	{
		private readonly IGame _game;
		
		public EngineTest()
		{
			_game = new Game.Game();
		}

		private static (int, int) GetCount(char[,] field)
		{
			var ships = 0;
			var cells = 0;
			for (var i = 0; i < field.GetUpperBound(0) + 1; i++)
			{
				for (var j = 0; j < field.GetUpperBound(1) + 1; j++)
				{
					cells++;
					if (field[i, j] != ' ')
						ships++;
				}
			}

			return (cells, ships);
		}
		
		[Theory]
		[InlineData(6, 6)]
		[InlineData(8, 8)]
		[InlineData(12, 9)]
		[InlineData(13, 7)]
		[InlineData(8, 7)]
		[InlineData(10, 10)]
		public void StartCustomSize(int rows, int cols)
		{
			var gameState = _game.StartGame(rows, cols);
			var field = gameState.PlayerState.Field;
			var (cells, ships) = GetCount(field);
			ships.Should().Be(9);
			cells.Should().Be(rows * cols);
		}
		
		[Theory]
		[InlineData(0, 0)]
		public void Shot(int x, int y)
		{
			var gameState = _game.StartGame();
			var newGameState = _game.Shoot(new ShootRequest
			{
				X = x,
				Y = y
			}, gameState);
			newGameState.PlayerState.Field[x, y].Should().Be('X');
		}
	}
}