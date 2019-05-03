import * as PIXI from 'pixi.js'
import { GameObject } from "./GameObject";

export class Particle extends GameObject {
	private t: number;

	constructor(pos: PIXI.IPoint) {
		const r = 2 + Math.random() * 2;
		const speed = 0.7 * Math.random();
		const angle = Math.PI * 2 * Math.random();
		const vx = speed * Math.cos(angle);
		const vy = speed * Math.sin(angle);
		const sprite = new PIXI.Graphics();
		sprite.beginFill(0xff0000, 1);
		sprite.drawCircle(0, 0, r)
		sprite.endFill();

		super(sprite, r, [vx, vy]);
		
		this.sprite.position.copyFrom(pos);
		this.t = 0;
	}

	public step(dt: number) {
		super.step(dt);
		this.t += dt;
		const lifetime = 500;
		if (this.t > lifetime) {
			this.dead = true;
		}
	}
}