import * as pixi from 'pixi.js';
import { Grapple, GrappleState } from './Grapple';

export class GrappleRenderer {
    private _graphics: pixi.Graphics;

    public constructor(private _grapple: Grapple, private _app: pixi.Application) {
        this._graphics = new pixi.Graphics();
        _app.stage.addChild(this._graphics);
    }

    public render = () => {
        switch(this._grapple.state) {
            case GrappleState.ready: {
                this._graphics.visible = false;
                break;
            }
            case GrappleState.fired: {
                this._graphics.visible = true;
                this._graphics.clear();
                this._graphics.beginFill(0xaaaaaa);
                const {x, y} = this._grapple.headPosition();
                this._graphics.drawCircle(x, y, 4);
                this._graphics.endFill();
                break;
            }
            case GrappleState.attached: {
                this._graphics.visible = true;
                this._graphics.clear();
                this._graphics.lineStyle(1, 0x0, 1);
                const headPos = this._grapple.headPosition();
                const tailPos = this._grapple.tailPosition();
                this._graphics.moveTo(tailPos.x, tailPos.y);
                this._graphics.lineTo(headPos.x, headPos.y);
                break;
            }
        }
    };
}
