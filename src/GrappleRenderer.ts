import * as pixi from 'pixi.js';
import { Grapple, GrappleState } from './Grapple';

export class GrappleRenderer {
    private _graphics: pixi.Graphics;

    public constructor(private _grapple: Grapple, private _app: pixi.Application) {
        this._graphics = new pixi.Graphics();
        _app.stage.addChild(this._graphics);
    }

    public render = () => {
        if (this._grapple.state === GrappleState.fired) {
            this._graphics.clear();
            this._graphics.beginFill(0xaaaaaa);
            const {x, y} = this._grapple.position();
            this._graphics.drawCircle(x, y, 4);
            this._graphics.endFill();
        }
    };
}
