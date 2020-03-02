import * as pixi from 'pixi.js';
import { Block } from './Block';

export class BlockRenderer {
    private _block: Block;
    private _graphics: pixi.Graphics;

    public constructor(block: Block) {
        this._block = block;
        this._graphics = new pixi.Graphics();
        this.render();
    }

    public render = () => {
        this._graphics.beginFill(0xaaaaaa);
        const topLeft = this._block.topLeft();
        this._graphics.drawRect(topLeft.x, topLeft.y, this._block.widthPx, this._block.heightPx);
        this._graphics.endFill();
    };

    public addToStage = (stage: pixi.Container) => {
        stage.addChild(this._graphics);
    };
}
