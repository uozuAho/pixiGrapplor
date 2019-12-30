import { Point2d } from "../Point2d";

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
    position: () => Point2d;
    setPosition: (pos: Point2d) => void;
}
