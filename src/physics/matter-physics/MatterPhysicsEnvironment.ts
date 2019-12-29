import matter from 'matter-js';
import { PhysicsEnvironment } from '../PhysicsEnvironment';
import { PhysicalObject } from '../PhysicalObject';

export class MatterPhysicsEnvironment implements PhysicsEnvironment {
    private _engine: matter.Engine;

    constructor(engine: matter.Engine) {
        this._engine = engine;
    }

    public addObject(object: PhysicalObject) {
        matter.World.add(this._engine.world, object.body);
    }
}
