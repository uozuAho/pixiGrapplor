import * as pixi from 'pixi.js';
import { Block } from './game_objects/block/Block';
import { BlockRenderer } from './game_objects/block/BlockRenderer';
import { Dude, Dude2 } from './game_objects/dude/Dude';
import { DudeRenderer } from './game_objects/dude/DudeRenderer';
import { KeysDown } from './KeysDown';
import { newPhysicsEnvironment } from './physics/PhysicsEnvironmentFactory';
import { PhysicsEnvironment } from "./physics/PhysicsEnvironment";
import { Grapple } from './game_objects/grapple/Grapple';
import { GrappleRenderer } from './game_objects/grapple/GrappleRenderer';
import { CircleRenderer } from './renderers/circle_renderer';

export class Grapplor {
    private _pixi = new pixi.Application();
    private _physicsEnv = newPhysicsEnvironment();

    private _keysDown: KeysDown;

    public run = () => {
        this.initWorld();

        const dude2 = new Dude2(this._pixi, this._physicsEnv);

        this._pixi.ticker.add((elapsedFrames: number) => {
            let ms = this._pixi.ticker.elapsedMS;
            // hack: Keep timestep at/under 20ms
            //       Rendering/reload times often blow out due to... browser?
            //       Large timesteps cause dude to fall through walls, lol.
            if (ms > 20) { ms = 20 };
            this._physicsEnv.update(ms);
            dude2.update(ms, this._keysDown);
            dude2.render();
        });
    }

    private resize = () => {
        // HACK: `as any`: Property 'clientWidth' does not exist
        //       on type 'Node & ParentNode' (it does, bad type)
        const parent = this._pixi.view.parentNode as any;
        this._pixi.renderer.resize(parent.clientWidth, parent.clientHeight);
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

    private addGameObjects() {
        const { dude, dudeRenderer, dudeDebugRenderer } = this.initDude();
        const { grapple, grappleRenderer } = this.initGrapple();
        dude.setGrapple(grapple);
        return { dude, dudeRenderer, dudeDebugRenderer, grappleRenderer };
    }

    private initGrapple() {
        const grapple = new Grapple(this._physicsEnv);
        const grappleRenderer = new GrappleRenderer(grapple, this._pixi);
        return { grapple, grappleRenderer };
    }

    private initDude() {
        const dude = new Dude(300, 350);
        const dudeRenderer = new DudeRenderer(dude);
        const dudeDebugRenderer = new CircleRenderer(this._pixi, 16);
        dudeRenderer.loadAssets(this._pixi);
        dude.addPhysics(this._physicsEnv);
        return { dude, dudeRenderer, dudeDebugRenderer };
    }

    private initWorld() {
        this.initGraphics();
        this.initKeyHandlers();
        this.createWorld(this._physicsEnv);
    }

    private initKeyHandlers() {
        this._keysDown = new KeysDown();
        this.addKeyHandlers();
    }

    private initGraphics() {
        this._pixi.renderer.backgroundColor = 0xeeeeee;
        document.querySelector('#gamediv').appendChild(this._pixi.view);
        window.addEventListener('resize', this.resize);
        this.resize();
    }

    private createWorld(physicsEnv: PhysicsEnvironment) {
        const middleBlock = new Block(300, 420, 300, 20, 'platform');
        middleBlock.addPhysics(physicsEnv);
        const middleBlockRenderer = new BlockRenderer(middleBlock);
        middleBlockRenderer.addToStage(this._pixi.stage);

        // walls at edge of world
        for (const w of [
            {x:   0, y:   0, width:  10, height: 600, label: 'left wall'},
            {x: 600, y: 300, width:  10, height: 600, label: 'right wall'},
            {x: 300, y: 600, width: 600, height:  10, label: 'floor'},
        ]) {
            const worldEdgeBarrier = new Block(w.x, w.y, w.width, w.height, w.label);
            worldEdgeBarrier.addPhysics(physicsEnv);
            const worldEdgeBarrierRenderer = new BlockRenderer(worldEdgeBarrier);
            worldEdgeBarrierRenderer.addToStage(this._pixi.stage);
        }
    }
}
