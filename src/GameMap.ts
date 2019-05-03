import * as PIXI from 'pixi.js'
import { GameObject } from './GameObject';

class Stars {
	public readonly container = new PIXI.Container();
	private readonly v: number;
	private readonly width: number;
	private readonly height: number;

	constructor(v: number, width: number, height: number) {
		this.v = v;
		this.width = width;
		this.height = height;

		const starNum = 100;
		const minRadius = 1;
		const maxRadius = 2;
		for (let i = 0; i < starNum; i++) {
			const star = new PIXI.Graphics();
			star.beginFill(0xffffff, 1);
			star.drawCircle(0, 0, minRadius + Math.random() * (maxRadius - minRadius));
			star.endFill();

			star.x = Math.random() * this.width;
			star.y = Math.random() * this.height;
			this.container.addChild(star);
		}
	}

	public step(dt: number) {
		this.container.children.forEach(child => {
			child.x -= this.v * dt;
			if (child.x < 0) {
				child.x += this.width;
			}
		});
	}
}

export class GameMap {
	private readonly stars: Stars[] = [];
	public readonly container = new PIXI.Container();
	public readonly width: number;
	public readonly height: number;

	constructor (width: number, height: number) {
		this.width = width;
		this.height = height;

		this.initBackground();
	}

	private initBackground() {
		for (let i = 0; i < 2; i++) {
			const v = 0.1 + 0.02 * i;
			const stars = new Stars(v, this.width, this.height);
			this.stars.push(stars);
			this.container.addChild(stars.container);
		}
	}

	public step(dt: number) {
		this.stars.forEach(s => s.step(dt));
	}

	public isOutside(gameObject: GameObject) {
		if (gameObject.sprite.x < -gameObject.r) {
			return true;
		}
		if (gameObject.sprite.x > this.width + gameObject.r) {
			return true;
		}
		if (gameObject.sprite.y < -gameObject.r) {
			return true;
		}
		if (gameObject.sprite.y > this.height + gameObject.r) {
			return true;
		}
	}
}