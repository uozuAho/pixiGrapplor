import { Point2d } from "./Point2d";
import { 
    PhysicsEnvironment,
    PhysicalBody
} from "./physics/PhysicsEnvironment";

export enum GrappleState {
    ready,
    fired
}

export class Grapple {
    public state = GrappleState.ready;

    private _physicalBody: PhysicalBody = null;

    constructor(private _physicsEnv: PhysicsEnvironment) {}

    public canLaunch = () => this.state === GrappleState.ready;

    public position = () => this._physicalBody.position();

    public launch = (position: Point2d, fireLeft: boolean) => {
        if (this.canLaunch()) {
            this.state = GrappleState.fired;
            let {x, y} = position;
            // start away from launcher
            const xOffset = fireLeft ? -30 : 30;
            x += xOffset; 
            y -= 30;
            this._physicalBody = this._physicsEnv.addDynamicCircle(x, y, 10);
            const xAcceleration = fireLeft ? -10 : 10;
            this._physicalBody.accelerateX(xAcceleration);
            this._physicalBody.accelerateY(-20);
            this._physicalBody.addOnCollisionStart(this._physicsEnv, collision => {
                this._physicsEnv.removeBody(this._physicalBody);
                this._physicalBody = null;
                this.state = GrappleState.ready;
            });
        }
    }
}
