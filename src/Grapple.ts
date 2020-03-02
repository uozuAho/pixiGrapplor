import { Point2d } from "./Point2d";
import { 
    PhysicsEnvironment,
    PhysicalBody,
    Constraint
} from "./physics/PhysicsEnvironment";
import { Logger } from "./logger";

export enum GrappleState {
    ready,
    fired,
    attached
}

export class Grapple {
    public state = GrappleState.ready;

    private _grappleHead: PhysicalBody = null;
    private _launchingBody: PhysicalBody = null;
    private _grappleString: Constraint;

    private _log: Logger;

    constructor(private _physicsEnv: PhysicsEnvironment) {}

    public setLauncher(body: PhysicalBody) {
        this._launchingBody = body;
        this._log = Logger.getInstance();
    }

    public canLaunch = () => this.state === GrappleState.ready;

    public headPosition = () => {
        if (this.state == GrappleState.fired) return this._grappleHead.position();
        if (this.state == GrappleState.attached) return this._grappleString.head();
    }

    public tailPosition = () => this._launchingBody.position();

    public launch = (launcherPosition: Point2d, launchLeft: boolean) => {
        if (this.canLaunch()) {
            this.state = GrappleState.fired;
            const launchPosition = this.calculateLaunchPosition(launcherPosition, launchLeft);
            this.initGrappleHead(launchPosition, launchLeft);
        }
    }

    private calculateLaunchPosition = (launcherPosition: Point2d, launchLeft: boolean): Point2d => {
        let {x, y} = launcherPosition;
        // start away from launcher
        const xOffset = launchLeft ? -30 : 30;
        return new Point2d(x + xOffset, y - 30);
    }

    private initGrappleHead = (position: Point2d, launchingLeft: boolean) => {
        const xAcceleration = launchingLeft ? -10 : 10;
        this._grappleHead = this._physicsEnv.addDynamicCircle(position.x, position.y, 10, 'grappleHead');
        this._grappleHead.accelerateX(xAcceleration);
        this._grappleHead.accelerateY(-20);
        this._grappleHead.addOnCollisionStart(this._physicsEnv, collision => {
            this.trace(`collide with ${collision.otherBody.label}`);
            const collisionPoint = this._grappleHead.position();
            this._physicsEnv.removeBody(this._grappleHead);
            this._grappleHead = null;
            this.initGrappleString(collisionPoint);
            this.state = GrappleState.attached;
        });
    }

    private initGrappleString = (collisionPoint: Point2d) => {
        this._grappleString = this._physicsEnv.addStiffLink(this._launchingBody, collisionPoint);
    }

    private trace = (msg: string) => {
        this._log.trace("Grapple: " + msg);
    }
}
