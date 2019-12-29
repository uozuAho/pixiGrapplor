import { PhysicalObject } from "./PhysicalObject";

export interface PhysicsEnvironment {
    addObject(object: PhysicalObject): void;
}
