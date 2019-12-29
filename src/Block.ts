import { Point2d } from "./Point2d";
import { PhysicsEnvironment } from './physics/PhysicsEnvironment';
import { PhysicalObject } from './physics/PhysicalObject';
import { FixedRectangle } from './physics/matter-physics/FixedRectangle';

export class Block {
    public centerPx: Point2d;
    public widthPx: number;
    public heightPx: number;

    private _physicsBody: PhysicalObject;

    public constructor(x: number, y: number, width: number, height: number) {
        this.centerPx = new Point2d(x, y);
        this.widthPx = width;
        this.heightPx = height;
    }

    public addPhysics = (env: PhysicsEnvironment) => {
        const { x, y } = this.centerPx;
        // todo: remove matter dep from rectangle
        this._physicsBody = new FixedRectangle(x, y, this.widthPx, this.heightPx);
        env.addObject(this._physicsBody);
    };

    public topLeft = (): Point2d => {
        const x = this.centerPx.x - this.widthPx / 2;
        const y = this.centerPx.y - this.heightPx / 2;
        return new Point2d(x, y);
    };
}
