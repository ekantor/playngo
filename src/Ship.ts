import * as PIXI from 'pixi.js'
import { GameObject } from './GameObject';
import { Keyboard } from './Keyboard';
import { GameMap } from './GameMap';
import { Bullet } from './Bullet';

export abstract class Ship extends GameObject {
	protected abstract readonly speed: number;

	constructor(sprite: PIXI.Sprite) {
		super(sprite, sprite.width / 2)
		sprite.anchor.set(0.5, 0.5);
	}

	protected normalizeSpeed() {
		const speed = Math.sqrt(this.v[0] * this.v[0] + this.v[1] * this.v[1]);
		if (speed > 0) {
			this.v[0] *= this.speed / speed;
			this.v[1] *= this.speed / speed;
		}
	}

	public abstract stayInsideMap(map: GameMap): void;
}

export class Player extends Ship {
	public readonly speed = 0.3;
	private readonly shotInterval = 500;
	private shotTimer = this.shotInterval;

	constructor(resources: PIXI.IResourceDictionary) {
		super(new PIXI.Sprite(resources.player.texture));
		this.sprite.rotation = Math.PI/2;
	}

	public handleInput(keyboard: Keyboard) {
		this.v[0] = this.v[1] = 0;
		if (keyboard.isPressed('ArrowLeft') || keyboard.isPressed('a')) {
			this.v[0] -= 1;
		}
		if (keyboard.isPressed('ArrowRight') || keyboard.isPressed('d')) {
			this.v[0] += 1;
		}
		if (keyboard.isPressed('ArrowDown') || keyboard.isPressed('s')) {
			this.v[1] += 1;
		}
		if (keyboard.isPressed('ArrowUp') || keyboard.isPressed('w')) {
			this.v[1] -= 1;
		}
		this.normalizeSpeed();

		const bullets: Bullet[] = [];
		if (keyboard.isPressed(' ') && this.shotTimer > this.shotInterval) {
			this.shotTimer = 0;
			bullets.push(new Bullet(this.sprite.x + this.r, this.sprite.y));
		}
		return bullets;
	}

	public step(dt: number) {
		super.step(dt);
		this.shotTimer += dt;
	}

	public stayInsideMap(map: GameMap) {
		if (this.sprite.x < this.r) {
			this.sprite.x = this.r;
		}
		if (this.sprite.x > map.width - this.r) {
			this.sprite.x = map.width - this.r;
		}
		if (this.sprite.y < this.r) {
			this.sprite.y = this.r;
		}
		if (this.sprite.y > map.height - this.r) {
			this.sprite.y = map.height - this.r;
		}
	}
}

export class Enemy extends Ship {
	public readonly speed = 0.2;
	private moveTimer = 0;

	constructor(resources: PIXI.IResourceDictionary) {
		super(new PIXI.Sprite(resources.enemy.texture));
		this.sprite.rotation = -Math.PI/2;

		this.v[0] = -1;
		this.normalizeSpeed();
	}

	public step(dt: number) {
		this.moveRandomly(dt);
		super.step(dt);
	}

	private moveRandomly(dt: number) {
		this.moveTimer += dt;
		if (this.moveTimer > 500) {
			this.v[0] = -1;

			let rand = Math.random();
			if (rand < 1/3) {
				this.v[1] = 1;
			} else if (rand < 2/3) {
				this.v[1] = -1;
			} else {
				this.v[1] = 0;
			}

			this.moveTimer = 0;
			
			this.normalizeSpeed();
		}
	}

	public stayInsideMap(map: GameMap) {
		if (this.sprite.y < this.r) {
			this.v[0] = -1;
			this.v[1] = 1;
			this.moveTimer = 0;
		}
		if (this.sprite.y > map.height - this.r) {
			this.v[0] = -1;
			this.v[1] = -1;
			this.moveTimer = 0;
		}
		this.normalizeSpeed();
	}
}