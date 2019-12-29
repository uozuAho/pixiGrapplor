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

        const dude = new Dude(300, 350);
        const dudeRenderer = new DudeRenderer(dude);
        dudeRenderer.loadAssets(this._app);
        dude.addPhysics(engine);

        const block = new Block(300, 420, 300, 20);
        block.addPhysics(engine);
        const blockRenderer = new BlockRenderer(block);
        blockRenderer.addToStage(this._app.stage);

        this._app.ticker.add((elapsedFrames: number) => {
            const ms = this._app.ticker.elapsedMS;
            matter.Engine.update(engine, 5);
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
    public centerPx: Point2d;
    public heightPx = 32;
    public widthPx = 32;

    private _physicsBody: matter.Body;

    public constructor(x: number, y: number) {
        this.centerPx = new Point2d(x, y);
    }

    public update = (elapsedMs: number, keysDown: KeysDown) => {
        this.centerPx.x = this._physicsBody.position.x;
        this.centerPx.y = this._physicsBody.position.y;
        if (keysDown.left) {
            this.centerPx.x -= 5;
        }
        if (keysDown.right) {
            this.centerPx.x += 5;
        }
    }

    public addPhysics = (engine: matter.Engine) => {
        const {x, y} = this.centerPx;
        this._physicsBody = matter.Bodies.rectangle(x, y, this.widthPx, this.heightPx);
        matter.World.add(engine.world, this._physicsBody);
    }

    public topLeft = (): Point2d => {
        const x = this.centerPx.x - this.widthPx / 2;
        const y = this.centerPx.y - this.heightPx / 2;
        return new Point2d(x, y);
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
    }
}

class Block {
    public centerPx: Point2d;
    public widthPx: number;
    public heightPx: number;

    private _physicsBody: matter.Body;

    public constructor(x: number, y: number, width: number, height: number) {
        this.centerPx = new Point2d(x, y);
        this.widthPx = width;
        this.heightPx = height;
    }

    public addPhysics = (engine: matter.Engine) => {
        const {x, y} = this.centerPx;
        this._physicsBody = matter.Bodies.rectangle(
            x, y, this.widthPx, this.heightPx, {isStatic: true});
        matter.World.add(engine.world, this._physicsBody);
    }

    public topLeft = (): Point2d => {
        const x = this.centerPx.x - this.widthPx / 2;
        const y = this.centerPx.y - this.heightPx / 2;
        return new Point2d(x, y);
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
        const topLeft = this._block.topLeft();
        this._graphics.drawRect(topLeft.x, topLeft.y, this._block.widthPx, this._block.heightPx);
        this._graphics.endFill();
    }

    public addToStage = (stage: pixi.Container) => {
        stage.addChild(this._graphics);
    }
}

class Point2d {
    constructor(public x: number, public y: number) {}
}
