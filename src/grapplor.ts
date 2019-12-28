import * as pixi from 'pixi.js';
import matter from 'matter-js';

export class Grapplor {
    private _app = new pixi.Application();

    private _keysDown: KeysDown;

    public run = () => {
        document.querySelector('#gamediv').appendChild(this._app.view);
        window.addEventListener('resize', this.resize);
        const engine = matter.Engine.create();

        this.resize();

        this._keysDown = new KeysDown();

        this.addKeyHandlers();

        const dude = new Dude(300, 380);
        const dudeRenderer = new DudeRenderer(dude);
        dudeRenderer.loadAssets(this._app);
        dude.addPhysics(engine);

        const block = new Block(100, 420, 300, 20);
        const blockRenderer = new BlockRenderer(block);
        blockRenderer.addToStage(this._app.stage);

        this._app.ticker.add((elapsedFrames: number) => {
            const ms = this._app.ticker.elapsedMS;
            matter.Engine.update(engine, ms);
            dude.update(ms, this._keysDown);
            dudeRenderer.update();
        });
    }

    private resize = () => {
        // HACK: `as any`: Property 'clientWidth' does not exist
        //       on type 'Node & ParentNode' (it does, bad type)
        const parent = this._app.view.parentNode as any;
        this._app.renderer.resize(parent.clientWidth, parent.clientHeight);
    }

    private addKeyHandlers = () => {
        addEventListener("keydown", (e: KeyboardEvent) => {
            this.handleKeyDown(e.keyCode);
        }, false);
        addEventListener("keyup", (e: KeyboardEvent) => {
            this.handleKeyUp(e.keyCode);
        }, false);
    }

    private handleKeyDown = (keyCode: number) => {
        switch (keyCode) {
            case 38: this._keysDown.up    = true; break;
            case 40: this._keysDown.down  = true; break;
            case 37: this._keysDown.left  = true; break;
            case 39: this._keysDown.right = true; break;
        }
    };
    
    private handleKeyUp = (keyCode: number) => {
        switch (keyCode) {
            case 38: this._keysDown.up    = false; break;
            case 40: this._keysDown.down  = false; break;
            case 37: this._keysDown.left  = false; break;
            case 39: this._keysDown.right = false; break;
        }
    };
}

class KeysDown {
    up = false;
    down = false;
    left = false;
    right = false;
}

class Dude {
    public _position: Point2d;
    private _physicsBody: matter.Body;

    public constructor(x: number, y: number) {
        this._position = new Point2d(x, y);
    }

    public update = (elapsedMs: number, keysDown: KeysDown) => {
        this._position.x = this._physicsBody.position.x;
        this._position.y = this._physicsBody.position.y;
        if (keysDown.left) {
            this._position.x -= 5;
        }
        if (keysDown.right) {
            this._position.x += 5;
        }
    }

    public addPhysics = (engine: matter.Engine) => {
        const x = this._position.x;
        const y = this._position.y;
        this._physicsBody = matter.Bodies.rectangle(x, y, 20, 20); // todo: size
        matter.World.add(engine.world, this._physicsBody);
    }
}

class DudeRenderer {
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
            sprite.x = this._dude._position.x;
            sprite.y = this._dude._position.y;

            app.stage.addChild(sprite);
            this._sprite = sprite;

            this._assetsLoaded = true;
        });
    }

    public update = () => {
        if (this._assetsLoaded) {
            this._sprite.x = this._dude._position.x;
            this._sprite.y = this._dude._position.y;
        }
    }
}

class Block {
    public _coordsPx: Point2d;
    public _widthPx: number;
    public _heightPx: number;

    public constructor(x: number, y: number, width: number, height: number) {
        this._coordsPx = new Point2d(x, y);
        this._widthPx = width;
        this._heightPx = height;
    }
}

class BlockRenderer {
    private _block: Block;
    private _graphics: pixi.Graphics;

    public constructor(block: Block) {
        this._block = block;
        this._graphics = new pixi.Graphics();
        this.render();
    }

    public render = () => {
        this._graphics.beginFill(0xaaaaaa);
        const {x, y} = this._block._coordsPx;
        this._graphics.drawRect(x, y, this._block._widthPx, this._block._heightPx);
        this._graphics.endFill();
    }

    public addToStage = (stage: pixi.Container) => {
        stage.addChild(this._graphics);
    }
}

class Point2d {
    constructor(public x: number, public y: number) {}
}
