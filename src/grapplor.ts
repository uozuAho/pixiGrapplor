import * as pixi from 'pixi.js';
import { Block } from './Block';
import { BlockRenderer } from './BlockRenderer';
import { Dude } from './Dude';
import { DudeRenderer } from './DudeRenderer';
import { KeysDown } from './KeysDown';
import { newPhysicsEnvironment } from './physics/PhysicsEnvironmentFactory';
import { PhysicsEnvironment } from "./physics/PhysicsEnvironment";

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

        this.createWorld(physicsEnv);

        this._app.ticker.add((elapsedFrames: number) => {
            let ms = this._app.ticker.elapsedMS;
            // hack: Keep timestep at/under 20ms
            //       Rendering/reload times often blow out due to... browser?
            //       Large timesteps cause dude to fall through walls, lol.
            if (ms > 20) { ms = 20 };
            physicsEnv.update(ms);
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
            case 32: this._keysDown.space = true; break;
        }
    };

    private handleKeyUp = (keyCode: number) => {
        switch (keyCode) {
            case 38: this._keysDown.up    = false; break;
            case 40: this._keysDown.down  = false; break;
            case 37: this._keysDown.left  = false; break;
            case 39: this._keysDown.right = false; break;
            case 32: this._keysDown.space = false; break;
        }
    };

    private createWorld(physicsEnv: PhysicsEnvironment) {
        const middleBlock = new Block(300, 420, 300, 20);
        middleBlock.addPhysics(physicsEnv);
        const middleBlockRenderer = new BlockRenderer(middleBlock);
        middleBlockRenderer.addToStage(this._app.stage);

        // walls at edge of world
        for (const dims of [
            //   x    y    w  h
            [0,   300, 10,  600],
            [600, 300, 10,  600],
            [300, 600, 600, 10]
        ]) {
            const worldEdgeBarrier = new Block(dims[0], dims[1], dims[2], dims[3]);
            worldEdgeBarrier.addPhysics(physicsEnv);
            const worldEdgeBarrierRenderer = new BlockRenderer(worldEdgeBarrier);
            worldEdgeBarrierRenderer.addToStage(this._app.stage);
        }
    }
}
