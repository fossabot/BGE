using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Threading.Tasks;
using BGE.Engine.Game;
using BGE.Engine.Hubs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace BGE.Engine
{
	public class Startup
	{
		public void ConfigureServices(IServiceCollection services)
		{
			services.AddAuthentication(options =>
			{
				options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
				options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
			}).AddJwtBearer(options =>
			{
				// Configure JWT Bearer Auth to expect our security key
				options.TokenValidationParameters =
					new TokenValidationParameters
					{
						ValidateAudience = false,
						ValidateIssuer = false,
						ValidateActor = false,
						ValidateLifetime = false,
						ValidateIssuerSigningKey = false,
						ValidateTokenReplay = false,
						SignatureValidator = SignatureValidator
					};
				

				// We have to hook the OnMessageReceived event in order to
				// allow the JWT authentication handler to read the access
				// token from the query string when a WebSocket or 
				// Server-Sent Events request comes in.
				options.Events = new JwtBearerEvents
				{
					OnMessageReceived = context =>
					{
						var accessToken = context.Request.Query["access_token"];

						// If the request is for our hub...
						var path = context.HttpContext.Request.Path;
						if (!string.IsNullOrEmpty(accessToken) &&
						    path.StartsWithSegments("/engine"))
						{
							// Read the token out of the query string
							context.Token = accessToken;
						}

						return Task.CompletedTask;
					}
				};
			});
			services.AddSignalR();
			services.AddTransient<IGame, Game.Game>();
		}

		private static SecurityToken SignatureValidator(string token, TokenValidationParameters validationParameters)
		{
			return new JwtSecurityToken(token);
		}

		public void Configure(IApplicationBuilder app, IHostingEnvironment env)
		{
			app.UseAuthentication();
			app.UseSignalR(routes => routes.MapHub<EngineHub>("/engine"));
		}
	}
}