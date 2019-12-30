import * as pixi from 'pixi.js';
import { Block } from './Block';
import { BlockRenderer } from './BlockRenderer';
import { Dude } from './Dude';
import { DudeRenderer } from './DudeRenderer';
import { KeysDown } from './KeysDown';
import { newPhysicsEnvironment } from './physics/PhysicsEnvironmentFactory';

export class Grapplor {
    private _app = new pixi.Application();

    private _keysDown: KeysDown;

    public run = () => {
        document.querySelector('#gamediv').appendChild(this._app.view);
        window.addEventListener('resize', this.resize);
        const physicsEnv = newPhysicsEnvironment();

        this.resize();

        this._keysDown = new KeysDown();

        this.addKeyHandlers();

        const dude = new Dude(300, 350);
        const dudeRenderer = new DudeRenderer(dude);
        dudeRenderer.loadAssets(this._app);
        dude.addPhysics(physicsEnv);

        const block = new Block(300, 420, 300, 20);
        block.addPhysics(physicsEnv);
        const blockRenderer = new BlockRenderer(block);
        blockRenderer.addToStage(this._app.stage);

        this._app.ticker.add((elapsedFrames: number) => {
            const ms = this._app.ticker.elapsedMS;
            physicsEnv.update(5);
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
