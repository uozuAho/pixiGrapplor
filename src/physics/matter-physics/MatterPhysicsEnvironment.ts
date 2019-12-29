import matter from 'matter-js';
import { PhysicsEnvironment } from '../PhysicsEnvironment';

export class MatterPhysicsEnvironment implements PhysicsEnvironment {
    private _engine: matter.Engine;

    constructor(engine: matter.Engine) {
        this._engine = engine;
    }

    public addFixedRect(
        centerXpx: number,
        centerYpx: number,
        width: number,
        height: number)
    {
        const rect = matter.Bodies.rectangle(centerXpx, centerYpx, width, height, {isStatic: true});
        matter.World.add(this._engine.world, rect);
    }
}
