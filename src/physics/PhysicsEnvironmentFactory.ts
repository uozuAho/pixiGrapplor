import { PhysicsEnvironment } from "./PhysicsEnvironment";
import { MatterPhysicsEnvironment } from './matter-physics/MatterPhysicsEnvironment';

export function newPhysicsEnvironment(): PhysicsEnvironment {
    return new MatterPhysicsEnvironment();
}
