import { Point2d } from "../Point2d";

export type CollisionCallback = (collision: Collision) => void;

export interface PhysicsEnvironment {
    update: (elapsedMs: number) => void;

    addFixedRect(
        centerXpx: number,
        centerYpx: number,
        width: number,
        height: number
        ): void;

    addDynamicRect(
        x: number,
        y: number,
        widthPx: number,
        heightPx: number
    ): PhysicalBody;
}

export interface PhysicalBody {
    accelerateX: (accelerationPxPerSec: number) => void;
    accelerateY: (accelerationPxPerSec: number) => void;
    position: () => Point2d;
    setPosition: (pos: Point2d) => void;
    addOnCollisionStart: (env: PhysicsEnvironment, callback: CollisionCallback) => void;
}

export interface Collision {
    thisBody: PhysicalBody,
    otherBody: PhysicalBody
}
