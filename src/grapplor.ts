import * as pixi from 'pixi.js';
import { Block } from './game_objects/block/Block';
import { BlockRenderer } from './game_objects/block/BlockRenderer';
import { Dude } from './game_objects/dude/Dude';
import { DudeRenderer } from './game_objects/dude/DudeRenderer';
import { KeysDown } from './KeysDown';
import { newPhysicsEnvironment } from './physics/PhysicsEnvironmentFactory';
import { PhysicsEnvironment } from "./physics/PhysicsEnvironment";
import { Grapple } from './game_objects/grapple/Grapple';
import { GrappleRenderer } from './game_objects/grapple/GrappleRenderer';
import { CircleRenderer } from './renderers/circle_renderer';

export class Grapplor {
    private _pixiApp = new pixi.Application();

    private _keysDown: KeysDown;

    public run = () => {
        this._pixiApp.renderer.backgroundColor = 0xeeeeee;
        document.querySelector('#gamediv').appendChild(this._pixiApp.view);
        window.addEventListener('resize', this.resize);
        const physicsEnv = newPhysicsEnvironment();

        this.resize();

        this._keysDown = new KeysDown();

        this.addKeyHandlers();

        const dude = new Dude(300, 350);
        const dudeRenderer = new DudeRenderer(dude);
        const dudeDebugRenderer = new CircleRenderer(this._pixiApp, 16);
        dudeRenderer.loadAssets(this._pixiApp);
        dude.addPhysics(physicsEnv);

        const grapple = new Grapple(physicsEnv);
        const grappleRenderer = new GrappleRenderer(grapple, this._pixiApp);
        dude.setGrapple(grapple);

        this.createWorld(physicsEnv);

        this._pixiApp.ticker.add((elapsedFrames: number) => {
            let ms = this._pixiApp.ticker.elapsedMS;
            // hack: Keep timestep at/under 20ms
            //       Rendering/reload times often blow out due to... browser?
            //       Large timesteps cause dude to fall through walls, lol.
            if (ms > 20) { ms = 20 };
            physicsEnv.update(ms);
            dude.update(ms, this._keysDown);
            dudeRenderer.render();
            dudeDebugRenderer.render(dude.centerPx);
            grappleRenderer.render();
        });
    }

    private resize = () => {
        // HACK: `as any`: Property 'clientWidth' does not exist
        //       on type 'Node & ParentNode' (it does, bad type)
        const parent = this._pixiApp.view.parentNode as any;
        this._pixiApp.renderer.resize(parent.clientWidth, parent.clientHeight);
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
            case 38: this._keysDown.up      = true; break;
            case 40: this._keysDown.down    = true; break;
            case 37: this._keysDown.left    = true; break;
            case 39: this._keysDown.right   = true; break;
            case 32: this._keysDown.jump    = true; break; // space
            case 81: this._keysDown.grapple = true; break; // q
        }
    };

    private handleKeyUp = (keyCode: number) => {
        switch (keyCode) {
            case 38: this._keysDown.up      = false; break;
            case 40: this._keysDown.down    = false; break;
            case 37: this._keysDown.left    = false; break;
            case 39: this._keysDown.right   = false; break;
            case 32: this._keysDown.jump    = false; break;
            case 81: this._keysDown.grapple = false; break;
        }
    };

    private createWorld(physicsEnv: PhysicsEnvironment) {
        const middleBlock = new Block(300, 420, 300, 20, 'platform');
        middleBlock.addPhysics(physicsEnv);
        const middleBlockRenderer = new BlockRenderer(middleBlock);
        middleBlockRenderer.addToStage(this._pixiApp.stage);

        // walls at edge of world
        for (const w of [
            {x:   0, y:   0, width:  10, height: 600, label: 'left wall'},
            {x: 600, y: 300, width:  10, height: 600, label: 'right wall'},
            {x: 300, y: 600, width: 600, height:  10, label: 'floor'},
        ]) {
            const worldEdgeBarrier = new Block(w.x, w.y, w.width, w.height, w.label);
            worldEdgeBarrier.addPhysics(physicsEnv);
            const worldEdgeBarrierRenderer = new BlockRenderer(worldEdgeBarrier);
            worldEdgeBarrierRenderer.addToStage(this._pixiApp.stage);
        }
    }
}
