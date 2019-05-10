using System.Threading.Tasks;
using BGE.Engine.Game;
using BGE.Engine.SignalR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;

namespace BGE.Engine
{
	public class Startup
	{
		public void ConfigureServices(IServiceCollection services)
		{
			services.AddSignalR();
			services.AddTransient<IGame, Game.Game>();
		}

		public void Configure(IApplicationBuilder app, IHostingEnvironment env)
		{
			/*app.Run(context =>
			{
				var game = new Game.Game();
				game.StartGame();
				return Task.CompletedTask;
			});*/
			app.UseSignalR(routes => routes.MapHub<EngineHub>("/engine"));
		}
	}
}