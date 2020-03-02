import { Point2d } from "../Point2d";

export type CollisionCallback = (collision: Collision) => void;

export interface PhysicsEnvironment {
    update: (elapsedMs: number) => void;

    removeBody: (body: PhysicalBody) => void;

    addFixedRect(
        centerXpx: number,
        centerYpx: number,
        width: number,
        height: number,
        label: string
    ): void;

    addDynamicRect(
        x: number,
        y: number,
        widthPx: number,
        heightPx: number,
        label: string
    ): PhysicalBody;

    addDynamicCircle(
        centerXpx: number,
        centerYpx: number,
        radiusPx: number,
        label: string
    ): PhysicalBody;

    addStiffLink(
        body: PhysicalBody,
        point: Point2d
    ): Constraint;
}

export interface PhysicalBody {
    label: string;
    speed: () => number;
    position: () => Point2d;
    accelerateX: (accelerationPxPerSec: number) => void;
    accelerateY: (accelerationPxPerSec: number) => void;
    setPosition: (pos: Point2d) => void;
    addOnCollisionStart: (env: PhysicsEnvironment, callback: CollisionCallback) => void;
}

export interface Collision {
    thisBody: PhysicalBody,
    otherBody: PhysicalBody
}

export interface Constraint {
    head: () => Point2d;
}
