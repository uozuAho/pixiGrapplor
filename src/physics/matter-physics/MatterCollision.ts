import { PhysicalBody, Collision } from '../PhysicsEnvironment';

export class MatterCollision implements Collision {
    constructor(public thisBody: PhysicalBody, public otherBody: PhysicalBody) { }
}
