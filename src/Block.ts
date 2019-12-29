import matter from 'matter-js';
import { Point2d } from "./Point2d";

export class Block {
    public centerPx: Point2d;
    public widthPx: number;
    public heightPx: number;

    private _physicsBody: matter.Body;

    public constructor(x: number, y: number, width: number, height: number) {
        this.centerPx = new Point2d(x, y);
        this.widthPx = width;
        this.heightPx = height;
    }

    public addPhysics = (engine: matter.Engine) => {
        const { x, y } = this.centerPx;
        this._physicsBody = matter.Bodies.rectangle(x, y, this.widthPx, this.heightPx, { isStatic: true });
        matter.World.add(engine.world, this._physicsBody);
    };

    public topLeft = (): Point2d => {
        const x = this.centerPx.x - this.widthPx / 2;
        const y = this.centerPx.y - this.heightPx / 2;
        return new Point2d(x, y);
    };
}
