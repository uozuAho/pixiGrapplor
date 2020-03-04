import * as pixi from 'pixi.js';
import { KeysDown } from "../../KeysDown";
import { Point2d } from "../../Point2d";
import { PhysicalBody } from '../../physics/PhysicsEnvironment';
import { PhysicsEnvironment } from "../../physics/PhysicsEnvironment";
import { Grapple } from "../grapple/Grapple";
import { IGameObject } from "../game_object";
import { DudeRenderer } from './DudeRenderer';
import { CircleRenderer } from '../../renderers/circle_renderer';
import { GrappleRenderer } from '../grapple/GrappleRenderer';

export class Dude2 implements IGameObject {
    _dude: Dude;
    _dudeRenderer: DudeRenderer;
    _dudeDebugRenderer: CircleRenderer;
    _grappleRenderer: GrappleRenderer;

    constructor (pixiApp: pixi.Application, physicsEnv: PhysicsEnvironment) {
        this._dude = new Dude(300, 350);
        this._dudeRenderer = new DudeRenderer(this._dude);
        this._dudeDebugRenderer = new CircleRenderer(pixiApp, 16);
        this._dudeRenderer.loadAssets(pixiApp);
        this._dude.addPhysics(physicsEnv);
        const grapple = new Grapple(physicsEnv);
        this._grappleRenderer = new GrappleRenderer(grapple, pixiApp);
        // todo: move grapple up to this object
        this._dude.setGrapple(grapple);
    }

    public update = (elapsedMs: number, keys: KeysDown) => {
        this._dude.update(elapsedMs, keys);
    }

    public render = () => {
        this._dudeRenderer.render();
        this._dudeDebugRenderer.render(this._dude.centerPx);
        this._grappleRenderer.render();
    }
}

export class Dude {
    public centerPx: Point2d;
    public heightPx = 31;
    public widthPx = 19;

    private _physicsBody: PhysicalBody;
    private _grapple: Grapple;
    private _canJump = false;
    private _facingLeft = true;

    public constructor(x: number, y: number) {
        this.centerPx = new Point2d(x, y);
    }

    public setGrapple(grapple: Grapple) {
        this._grapple = grapple;
        grapple.setLauncher(this._physicsBody);
    }

    public update = (elapsedMs: number, keysDown: KeysDown) => {
        const {x, y} = this._physicsBody.position();
        this.centerPx.x = x;
        this.centerPx.y = y;
        if (keysDown.left) {
            this._facingLeft = true;
            if (this._physicsBody.speed() < 10) {
                this._physicsBody.accelerateX(-1);
            }
        }
        if (keysDown.right) {
            this._facingLeft = false;
            if (this._physicsBody.speed() < 10) {
                this._physicsBody.accelerateX(1);
            }
        }
        if (keysDown.jump) {
            if (this._canJump) {
                this._physicsBody.accelerateY(-10);
                this._canJump = false;
            }
        }
        if (keysDown.grapple) {
            if (this._grapple.canLaunch()) {
                this._grapple.launch(this._physicsBody.position(), this._facingLeft);
            }
        }
    };

    public addPhysics = (env: PhysicsEnvironment) => {
        const { x, y } = this.centerPx;
        this._physicsBody = env.addDynamicCircle(x, y, 16, 'dude');
        this._physicsBody.addOnCollisionStart(env, collision => {
            this._canJump = true;
        });
    };

    public topLeft = (): Point2d => {
        const x = this.centerPx.x - this.widthPx / 2;
        const y = this.centerPx.y - this.heightPx / 2;
        return new Point2d(x, y);
    };

    public isFacingLeft = () => this._facingLeft;
}
