import * as PIXI from 'pixi.js'
import { GameMap } from "./GameMap";
import { Keyboard } from "./Keyboard";
import { Player, Enemy, Ship } from './Ship';
import { removeElementFromArray } from './Utils';
import { GameObject } from './GameObject';
import { Particle } from './Particle';
import { Bullet } from './Bullet';

export class Game {
	public readonly stage = new PIXI.Container();
	
	private readonly resources: PIXI.IResourceDictionary;
	private readonly keyboard = new Keyboard();

	private readonly gameObjects: GameObject[] = [];
	private readonly map: GameMap;
	
	private enemySpawnTimer = 0;

	private gameEnded = () => {};
	
	constructor(resources: PIXI.IResourceDictionary, width: number, height: number) {
		this.resources = resources;

		this.map = new GameMap(width, height);
		this.stage.addChild(this.map.container);

		this.createPlayer();
	}

	public onGameOver(handler: () => void) {
		this.gameEnded = handler;
	}

	public step(dt: number) {
		const player = this.getPlayer();
		if (player) {
			const bullets = player.handleInput(this.keyboard);
			bullets.forEach(bullet => this.addGameObject(bullet));
		}
		
		this.map.step(dt);
		this.spawnEnemy(dt);

		this.gameObjects.forEach(gameObj => gameObj.step(dt));
		const ships = <Ship[]>this.gameObjects.filter(gameObject => gameObject instanceof Ship);
		ships.forEach(ship => ship.stayInsideMap(this.map));
		this.checkCollisions();

		this.gameObjects.forEach(gameObj => {
			if (this.map.isOutside(gameObj)) {
				gameObj.dead = true;
			}
		});

		this.clearDeadObjects();
	}
	
	private addGameObject(object: GameObject) {
		this.stage.addChild(object.sprite);
		this.gameObjects.push(object);
	}

	private clearDeadObjects() {
		for (let i = this.gameObjects.length - 1; i >= 0; i--) {
			const obj = this.gameObjects[i];
			if (obj.dead) {
				this.stage.removeChild(obj.sprite);
				removeElementFromArray(this.gameObjects, obj);
			}
		}
	}

	private createPlayer() {
		const player = new Player(this.resources);
		player.sprite.x = this.map.width / 2;
		player.sprite.y = this.map.height / 2;
		this.addGameObject(player);
	}

	private getPlayer() {
		return <Player>this.gameObjects.find(gameObject => gameObject instanceof Player);
	}

	private spawnEnemy(dt: number) {
		this.enemySpawnTimer += dt;
		const enemySpawnInterval = 2000;
		if (this.enemySpawnTimer > enemySpawnInterval) {
			const enemy = new Enemy(this.resources);
			enemy.sprite.x = this.map.width;
			enemy.sprite.y = Math.random() * this.map.height;
			this.addGameObject(enemy);
			this.enemySpawnTimer = 0;
		}
	}

	private checkCollisions() {
		const enemies = <Enemy[]>this.gameObjects.filter(gameObject => gameObject instanceof Enemy);
		const player = this.getPlayer();
		if (player) {
			enemies.forEach(e => {
				if (e.collides(player)) {
					this.killShip(e);
					this.killShip(player);					
					this.gameEnded();
				}
			});
		}

		const bullets = this.gameObjects.filter(gameObject => gameObject instanceof Bullet);
		enemies.forEach(e => {
			bullets.forEach(b => {
				if (b.collides(e)) {
					this.killShip(e);
					b.dead = true;
				}
			})
		});
	}

	private killShip(ship: Ship) {
		this.explosion(ship.sprite.position);
		ship.dead = true;
	}

	private explosion(pos: PIXI.IPoint) {
		for(let i = 0; i < 10; i++) {
			this.addGameObject(new Particle(pos));
		}
	}
}