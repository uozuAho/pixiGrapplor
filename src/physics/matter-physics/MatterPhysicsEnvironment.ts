import matter from 'matter-js';
import { PhysicsEnvironment, PhysicalBody } from '../PhysicsEnvironment';
import { Point2d } from '../../Point2d';

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

class MatterBody implements PhysicalBody {
    constructor(private _body: matter.Body) {}

    public position = () => {
        const {x, y} = this._body.position;
        return new Point2d(x, y);
    }

    public setPosition = (pos: Point2d) => {
        this._body.position.x = pos.x;
        this._body.position.y = pos.y;
    }
}
