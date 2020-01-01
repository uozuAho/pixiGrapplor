import matter from 'matter-js';
import {
    PhysicalBody
} from '../PhysicsEnvironment';
import { PhysicsEnvironment } from "../PhysicsEnvironment";
import { MatterBody } from './MatterBody';

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
