import matter from 'matter-js';
import { KeysDown } from "./KeysDown";
import { Point2d } from "./Point2d";

export class Dude {
    public centerPx: Point2d;
    public heightPx = 32;
    public widthPx = 32;

    private _physicsBody: matter.Body;

    public constructor(x: number, y: number) {
        this.centerPx = new Point2d(x, y);
    }

    public update = (elapsedMs: number, keysDown: KeysDown) => {
        this.centerPx.x = this._physicsBody.position.x;
        this.centerPx.y = this._physicsBody.position.y;
        if (keysDown.left) {
            this.centerPx.x -= 5;
        }
        if (keysDown.right) {
            this.centerPx.x += 5;
        }
    };

    public addPhysics = (engine: matter.Engine) => {
        const { x, y } = this.centerPx;
        this._physicsBody = matter.Bodies.rectangle(x, y, this.widthPx, this.heightPx);
        matter.World.add(engine.world, this._physicsBody);
    };

    public topLeft = (): Point2d => {
        const x = this.centerPx.x - this.widthPx / 2;
        const y = this.centerPx.y - this.heightPx / 2;
        return new Point2d(x, y);
    };
}
