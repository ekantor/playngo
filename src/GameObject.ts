export abstract class GameObject {
	public readonly r: number;
	public readonly v = [0, 0];
	public readonly sprite: PIXI.DisplayObject;
	public dead = false;

	constructor(sprite: PIXI.DisplayObject, r: number, v = [0, 0]) {
		this.sprite = sprite;
		this.v = v.slice();
		this.r = r;
	}

	public step(dt: number) {
		this.sprite.x += this.v[0] * dt;
		this.sprite.y += this.v[1] * dt;
	}

	public collides(other: GameObject) {
		const dx = this.sprite.x - other.sprite.x;
		const dy = this.sprite.y - other.sprite.y;

		const r = this.r + other.r;

		return dx * dx + dy * dy < r * r;
	}
}