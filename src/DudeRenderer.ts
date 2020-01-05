import * as pixi from 'pixi.js';
import { Dude } from './Dude';

export class DudeRenderer {
    private _assetsLoaded = false;
    private _sprite: pixi.Sprite;
    private _dude: Dude;

    public constructor(dude: Dude) {
        this._dude = dude;
    }

    public loadAssets(app: pixi.Application) {
        const loader = pixi.Loader.shared;
        loader.add('dude', 'img/dude_left.png').load((loader, resources) => {
            const sprite = new pixi.Sprite(resources.dude.texture);
            const topLeft = this._dude.topLeft();
            sprite.x = topLeft.x;
            sprite.y = topLeft.y;
            sprite.anchor.set(0.5);
            app.stage.addChild(sprite);
            this._sprite = sprite;
            this._assetsLoaded = true;
        });
    }

    public render = () => {
        if (this._assetsLoaded) {
            const xScale = this._dude.isFacingLeft() ? 1 : -1;
            this._sprite.scale.x = xScale;
            this._sprite.x = this._dude.centerPx.x;
            this._sprite.y = this._dude.centerPx.y;
            // pixi renders the sprite automatically
        }
    };
}
