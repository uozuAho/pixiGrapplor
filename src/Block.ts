import { Point2d } from "./Point2d";
import { PhysicsEnvironment } from './physics/PhysicsEnvironment';

export class Block {
    public centerPx: Point2d;
    public widthPx: number;
    public heightPx: number;

    public constructor(x: number, y: number, width: number, height: number) {
        this.centerPx = new Point2d(x, y);
        this.widthPx = width;
        this.heightPx = height;
    }

    public addPhysics = (env: PhysicsEnvironment) => {
        const { x, y } = this.centerPx;
        env.addFixedRect(x, y, this.widthPx, this.heightPx);
    };

    public topLeft = (): Point2d => {
        const x = this.centerPx.x - this.widthPx / 2;
        const y = this.centerPx.y - this.heightPx / 2;
        return new Point2d(x, y);
    };
}
