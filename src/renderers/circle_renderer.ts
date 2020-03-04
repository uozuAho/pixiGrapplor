import * as pixi from 'pixi.js';
import { Point2d } from '../Point2d';

export class CircleRenderer {
    private _graphics: pixi.Graphics;

    public constructor(private _app: pixi.Application, private _radius: number) {
        this._graphics = new pixi.Graphics();
        _app.stage.addChild(this._graphics);
    }

    public render = (pos: Point2d) => {
        // this._graphics.visible = true;
        this._graphics.clear();
        this._graphics.lineStyle(1, 0xaaaa00);
        this._graphics.drawCircle(pos.x, pos.y, this._radius);
        this._graphics.endFill();
    };
}
