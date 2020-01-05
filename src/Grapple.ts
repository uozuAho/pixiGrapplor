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

    public launch = (launcherPosition: Point2d, launchLeft: boolean) => {
        if (this.canLaunch()) {
            this.state = GrappleState.fired;
            const launchPosition = this.calculateLaunchPosition(launcherPosition, launchLeft);
            this.initGrapplePhysicalBody(launchPosition, launchLeft);
        }
    }

    private calculateLaunchPosition = (launcherPosition: Point2d, launchLeft: boolean): Point2d => {
        let {x, y} = launcherPosition;
        // start away from launcher
        const xOffset = launchLeft ? -30 : 30;
        return new Point2d(x + xOffset, y - 30);
    }

    private initGrapplePhysicalBody = (position: Point2d, launchingLeft: boolean) => {
        const xAcceleration = launchingLeft ? -10 : 10;
        this._physicalBody = this._physicsEnv.addDynamicCircle(position.x, position.y, 10);
        this._physicalBody.accelerateX(xAcceleration);
        this._physicalBody.accelerateY(-20);
        this._physicalBody.addOnCollisionStart(this._physicsEnv, collision => {
            this._physicsEnv.removeBody(this._physicalBody);
            this._physicalBody = null;
            this.state = GrappleState.ready;
        });
    }
}
