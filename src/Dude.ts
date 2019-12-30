import { KeysDown } from "./KeysDown";
import { Point2d } from "./Point2d";
import { PhysicsEnvironment, PhysicalBody } from './physics/PhysicsEnvironment';

export class Dude {
    public centerPx: Point2d;
    public heightPx = 32;
    public widthPx = 32;

    private _physicsBody: PhysicalBody;

    public constructor(x: number, y: number) {
        this.centerPx = new Point2d(x, y);
    }

    public update = (elapsedMs: number, keysDown: KeysDown) => {
        const {x, y} = this._physicsBody.position();
        this.centerPx.x = x;
        this.centerPx.y = y;
        if (keysDown.left) {
            this._physicsBody.accelerateX(-1);
        }
        if (keysDown.right) {
            this._physicsBody.accelerateX(1);
        }
    };

    public addPhysics = (env: PhysicsEnvironment) => {
        const { x, y } = this.centerPx;
        this._physicsBody = env.addDynamicRect(x, y, this.widthPx, this.heightPx);
    };

    public topLeft = (): Point2d => {
        const x = this.centerPx.x - this.widthPx / 2;
        const y = this.centerPx.y - this.heightPx / 2;
        return new Point2d(x, y);
    };
}
