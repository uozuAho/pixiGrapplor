import matter from 'matter-js';
import { Constraint } from "../PhysicsEnvironment";

export class MatterConstraint implements Constraint {
    constructor(private _constraint: matter.Constraint) {}

    public head = () => {
        return this._constraint.pointB;
    }
}
