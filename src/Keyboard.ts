export class Keyboard {
	private keys: any = {};

	constructor() {
		document.addEventListener('keydown', e => this.keys[e.key] = true);
		document.addEventListener('keyup', e => this.keys[e.key] = false);
	}

	public isPressed(key: string) {
		return this.keys[key];
	}
}