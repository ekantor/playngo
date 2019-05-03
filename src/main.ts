import * as PIXI from 'pixi.js'

var app = new PIXI.Application({ width: 800, height: 600 });

import { Game } from './Game';

app.loader
	.add('splash', 'assets/splash.png')
	.add('menuBg', 'assets/menubg.jpg')
	.add('logo', 'assets/logo.png')
	.add('player', 'assets/ships/player.png')
	.add('enemy', 'assets/ships/enemy.png')
	.add('btnGame1', 'assets/buttons/game1.png')
	.add('btnGame1Hovered', 'assets/buttons/game1hov.png')
	.add('btnGame2', 'assets/buttons/game2.png')
	.add('btnGame2Hovered', 'assets/buttons/game2hov.png')
	.add('btnGame3', 'assets/buttons/game3.png')
	.add('btnGame3Hovered', 'assets/buttons/game3hov.png')
	.add('btnExit', 'assets/buttons/exit.png')
	.add('btnExitHovered', 'assets/buttons/exithov.png');

function showFadingAnimation(sprite: PIXI.Sprite) {
	return new Promise(resolve => {
		sprite.alpha = 0;
		app.stage.addChild(sprite);
	
		let t = 0;
		const step = () => {
			t += app.ticker.deltaMS;
	
			const fadeTime = 500;
			const showingTime = 2000;
			if (t < fadeTime) {
				sprite.alpha += app.ticker.deltaMS / fadeTime;
			}
			if (t > showingTime + fadeTime) {
				sprite.alpha -= app.ticker.deltaMS / fadeTime;
			}
			if (sprite.alpha < 0) {
				app.stage.removeChild(sprite);
				app.ticker.remove(step);	
				resolve();		
			}
		}
	
		app.ticker.add(step);
	})
}

function createButton(name: string) {
	const btn = new PIXI.Sprite(app.loader.resources[name].texture);
	btn.interactive = true;
	btn.buttonMode = true;
	btn.on('mouseover', () => btn.texture = app.loader.resources[name + 'Hovered'].texture);
	btn.on('mouseout', () => btn.texture = app.loader.resources[name].texture);
	return btn;
}

function startGame() {
	const game = new Game(app.loader.resources, app.view.width, app.view.height);

	const gameStep = () => game.step(app.ticker.deltaMS);

	game.onGameOver(() => {
		const text = new PIXI.Text('Game Over', { 
			fontFamily : 'Arial', 
			fontSize: 72, 
			fill : 0xff1010
		});
		text.anchor.set(0.5, 0.5);
		text.x = app.view.width / 2;
		text.y = app.view.height / 2;
		app.stage.addChild(text);
		showFadingAnimation(text).then(() => {
			app.stage.removeChild(game.stage);
			app.ticker.remove(gameStep);		
			showMainMenu();
		});
	});

	app.stage.addChild(game.stage);
	app.ticker.add(gameStep);
}

const showMainMenu = () => {
	const menuContainer = new PIXI.Container();
	app.stage.addChild(menuContainer);	

	const bg = new PIXI.Sprite(app.loader.resources.menuBg.texture);
	menuContainer.addChild(bg);
	let t = 0;
	const bgAnimation = () => {
		t += 3 * app.ticker.deltaMS / 10000;
		t %= 3;
		
		const rDist = Math.min(Math.abs(0 - t), Math.abs(3 + 0 - t));
		const gDist = Math.min(Math.abs(1 - t), Math.abs(3 + 1 - t));
		const bDist = Math.min(Math.abs(2 - t), Math.abs(3 + 2 - t));

		const r = Math.max(0, 1 - rDist);
		const g = Math.max(0, 1 - gDist);
		const b = Math.max(0, 1 - bDist);

		bg.tint = Math.floor(255 * r) << 16 | Math.floor(255 * g) << 8 | Math.floor(255 * b);
	}
	app.ticker.add(bgAnimation);

	const onGameClick = () => {
		app.ticker.remove(bgAnimation);
		app.stage.removeChild(menuContainer);
		startGame();
	}

	const logo = new PIXI.Sprite(app.loader.resources.logo.texture);
	menuContainer.addChild(logo);	
	logo.position.x = app.view.width / 2 - logo.width / 2;
	logo.position.y = 100;

	const buttonGap = 20;

	const btnGame1 = createButton('btnGame1');
	menuContainer.addChild(btnGame1);	
	btnGame1.position.x = app.view.width / 2 - btnGame1.width / 2;
	btnGame1.position.y = logo.position.y + logo.height + buttonGap;
	btnGame1.on('click', onGameClick);

	const btnGame2 = createButton('btnGame2');
	menuContainer.addChild(btnGame2);	
	btnGame2.position.x = app.view.width / 2 - btnGame2.width / 2;
	btnGame2.position.y = btnGame1.position.y + btnGame1.height + buttonGap;
	btnGame2.on('click', onGameClick);

	const btnGame3 = createButton('btnGame3');
	menuContainer.addChild(btnGame3);	
	btnGame3.position.x = app.view.width / 2 - btnGame3.width / 2;
	btnGame3.position.y = btnGame2.position.y + btnGame2.height + buttonGap;
	btnGame3.on('click', onGameClick);

	const btnExit = createButton('btnExit');
	menuContainer.addChild(btnExit);	
	btnExit.position.x = app.view.width / 2 - btnExit.width / 2;
	btnExit.position.y = btnGame3.position.y + btnGame3.height + buttonGap;
	btnExit.on('click', () => window.location.href = 'https://astrix.io');
}

function showSplashAnimation() {
	const splash = new PIXI.Sprite(app.loader.resources.splash.texture);
	return showFadingAnimation(splash);
}

window.onload = () => {
	document.body.appendChild(app.view);

	app.loader.load(() => showSplashAnimation().then(showMainMenu));
}