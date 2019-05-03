import * as PIXI from 'pixi.js'
import { GameObject } from "./GameObject";

export class Bullet extends GameObject {
	constructor(x: number, y: number) {
		const r = 3;

		const sprite = new PIXI.Graphics();
		sprite.beginFill(0xff8800, 1);
		sprite.drawCircle(0, 0, r)
		sprite.endFill();
		
		super(sprite, r, [0.6, 0]);
		
		this.sprite.position.set(x, y);
	}
}