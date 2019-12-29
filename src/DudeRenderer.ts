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
        loader.add('dude', 'img/hero.png').load((loader, resources) => {
            const sprite = new pixi.Sprite(resources.dude.texture);
            const topLeft = this._dude.topLeft();
            sprite.x = topLeft.x;
            sprite.y = topLeft.y;
            app.stage.addChild(sprite);
            this._sprite = sprite;
            this._assetsLoaded = true;
        });
    }

    public update = () => {
        if (this._assetsLoaded) {
            const topLeft = this._dude.topLeft();
            this._sprite.x = topLeft.x;
            this._sprite.y = topLeft.y;
        }
    };
}
