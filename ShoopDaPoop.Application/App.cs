﻿using Bridge.Html5;
using Bridge.Pixi;

namespace ShoopDaPoop.Application
{
	public class App
	{
		private static IRenderer renderer;
		private static Board board;

		[Ready]
		public static void Main()
		{
			renderer = Pixi.AutoDetectRenderer(800, 600, new RendererOptions
			{
				BackgroundColor = 0x1099bb,
				RoundPixels = true
			});
			Document.Body.AppendChild(renderer.View);
			var stage = new Container();
			board = new Board(5, 15);
			board.Container.Position.Set(10, 10);
			stage.AddChild(board.Container);
			Animate();
		}

		private static void Animate()
		{
			Window.RequestAnimationFrame(Animate);
			board.Update();
			board.PreRender();
			renderer.Render(board.Container);
		}
	}

}