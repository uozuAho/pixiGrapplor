import matter from 'matter-js';
import {
    PhysicsEnvironment,
    PhysicalBody,
    Collision,
    CollisionCallback
} from '../PhysicsEnvironment';
import { Point2d } from '../../Point2d';

export class MatterPhysicsEnvironment implements PhysicsEnvironment {
    private _engine: matter.Engine;

    constructor() {
        this._engine = matter.Engine.create();
    }

    public update = (elapsedMs: number) => matter.Engine.update(this._engine, elapsedMs);

    public addFixedRect(
        centerXpx: number,
        centerYpx: number,
        width: number,
        height: number)
    {
        const rect = matter.Bodies.rectangle(centerXpx, centerYpx, width, height, {isStatic: true});
        matter.World.add(this._engine.world, rect);
    }

    addDynamicRect(
        centerXpx: number,
        centerYpx: number,
        widthPx: number,
        heightPx: number
    ): PhysicalBody
    {
        const rect = matter.Bodies.rectangle(centerXpx, centerYpx, widthPx, heightPx);
        matter.World.add(this._engine.world, rect);
        return new MatterBody(rect);
    }
}

class MatterBody implements PhysicalBody {
    constructor(private _body: matter.Body) {}

    public position = () => {
        const {x, y} = this._body.position;
        return new Point2d(x, y);
    }

    public setPosition = (pos: Point2d) => {
        this._body.position.x = pos.x;
        this._body.position.y = pos.y;
    }

    public accelerateX = (accelerationPxPerSec: number) => {
        const fx = this._body.mass * accelerationPxPerSec / 100;
        this._body.force = {x: fx, y: this._body.force.y};
    }

    public accelerateY = (accelerationPxPerSec: number) => {
        const fy = this._body.mass * accelerationPxPerSec / 100;
        this._body.force = {x: this._body.force.x, y: fy};
    }

    public addOnCollisionStart = (env: PhysicsEnvironment, callback: CollisionCallback) => {
        // hack: Access internal engine to attach collision listener.
        //       Body collision listeners are not possible in matter-js without plugins
        const engine = (env as any)._engine;
        matter.Events.on(engine, 'collisionStart', event => {
            for (const pair of event.pairs) {
                if (pair.bodyA === this._body) {
                    callback(new MatterCollision(this, new MatterBody(pair.bodyB)));
                }
                if (pair.bodyB === this._body) {
                    callback(new MatterCollision(this, new MatterBody(pair.bodyA)));
                }
            }
        });
    };
}

class MatterCollision implements Collision {
    constructor(public thisBody: PhysicalBody, public otherBody: PhysicalBody) {}
}
