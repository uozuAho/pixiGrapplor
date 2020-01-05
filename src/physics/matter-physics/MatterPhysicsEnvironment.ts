import matter from 'matter-js';
import {
    PhysicalBody
} from '../PhysicsEnvironment';
import { PhysicsEnvironment } from "../PhysicsEnvironment";
import { MatterBody } from './MatterBody';

export class MatterPhysicsEnvironment implements PhysicsEnvironment {
    private _engine: matter.Engine;
    private _bodies: Map<PhysicalBody, matter.Body>;

    constructor() {
        this._engine = matter.Engine.create();
        this._bodies = new Map();
    }

    public update = (elapsedMs: number) => matter.Engine.update(this._engine, elapsedMs);

    public removeBody = (body: PhysicalBody) => {
        const matterBody = this._bodies.get(body);
        matter.World.remove(this._engine.world, matterBody);
        this._bodies.delete(body);
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

    public addDynamicRect(
        centerXpx: number,
        centerYpx: number,
        widthPx: number,
        heightPx: number
    ): PhysicalBody
    {
        const matterRect = matter.Bodies.rectangle(centerXpx, centerYpx, widthPx, heightPx);
        matter.World.add(this._engine.world, matterRect);
        const body = new MatterBody(matterRect);
        this._bodies.set(body, matterRect);
        return body;
    }

    public addDynamicCircle(
        centerXpx: number,
        centerYpx: number,
        radiusPx: number
    ): PhysicalBody
    {
        const matterCircle = matter.Bodies.circle(centerXpx, centerYpx, radiusPx);
        matter.World.add(this._engine.world, matterCircle);
        const body = new MatterBody(matterCircle);
        this._bodies.set(body, matterCircle);
        return body;
    }
}
