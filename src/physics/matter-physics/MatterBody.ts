import matter from 'matter-js';
import { PhysicalBody, CollisionCallback } from '../PhysicsEnvironment';
import { PhysicsEnvironment } from "../PhysicsEnvironment";
import { Point2d } from '../../Point2d';
import { MatterCollision } from "./MatterCollision";

export class MatterBody implements PhysicalBody {

    constructor(private _body: matter.Body, public label: string) { }

    public position = () => {
        const { x, y } = this._body.position;
        return new Point2d(x, y);
    };

    public speed = () => this._body.speed;

    public setPosition = (pos: Point2d) => {
        this._body.position.x = pos.x;
        this._body.position.y = pos.y;
    };

    public accelerateX = (accelerationPxPerSec: number) => {
        const fx = this._body.mass * accelerationPxPerSec / 500;
        this._body.force = { x: fx, y: this._body.force.y };
    };

    public accelerateY = (accelerationPxPerSec: number) => {
        const fy = this._body.mass * accelerationPxPerSec / 500;
        this._body.force = { x: this._body.force.x, y: fy };
    };
    
    public addOnCollisionStart = (env: PhysicsEnvironment, callback: CollisionCallback) => {
        // hack: Access internal engine to attach collision listener.
        //       Body collision listeners are not possible in matter-js without plugins
        const engine = (env as any)._engine;
        matter.Events.on(engine, 'collisionStart', event => {
            for (const pair of event.pairs) {
                if (pair.bodyA === this._body) {
                    callback(new MatterCollision(this, new MatterBody(pair.bodyB, pair.bodyB.label)));
                }
                if (pair.bodyB === this._body) {
                    callback(new MatterCollision(this, new MatterBody(pair.bodyA, pair.bodyA.label)));
                }
            }
        });
    };
}
