import * as pixi from 'pixi.js';
import { KeysDown } from "../../KeysDown";
import { PhysicsEnvironment } from "../../physics/PhysicsEnvironment";
import { Grapple, GrappleState } from "../grapple/Grapple";
import { IGameObject } from "../game_object";
import { DudeRenderer } from './DudeRenderer';
import { CircleRenderer } from '../../renderers/circle_renderer';
import { GrappleRenderer } from '../grapple/GrappleRenderer';
import { Dude } from './Dude';

export class DudeContainer implements IGameObject {

    private _dude: Dude;
    private _grapple: Grapple;
    private _dudeRenderer: DudeRenderer;
    private _dudeDebugRenderer: CircleRenderer;
    private _grappleRenderer: GrappleRenderer;
    private _grappleDebugRenderer: CircleRenderer;

    constructor(pixiApp: pixi.Application, physicsEnv: PhysicsEnvironment) {
        this._dude = new Dude(300, 350);
        this._dudeRenderer = new DudeRenderer(this._dude);
        this._dudeDebugRenderer = new CircleRenderer(pixiApp, 16);
        this._dudeRenderer.loadAssets(pixiApp);
        this._dude.addPhysics(physicsEnv);
        this._grapple = new Grapple(physicsEnv);
        this._grappleRenderer = new GrappleRenderer(this._grapple, pixiApp);
        this._grappleDebugRenderer = new CircleRenderer(pixiApp, 10);
        this._dude.setGrapple(this._grapple);
    }

    public update = (elapsedMs: number, keys: KeysDown) => {
        this._dude.update(elapsedMs, keys);
    };

    public render = () => {
        this._dudeRenderer.render();
        this._dudeDebugRenderer.render(this._dude.centerPx);
        this._grappleRenderer.render();
        if (this._grapple.state === GrappleState.fired) {
            this._grappleDebugRenderer.render(this._grapple.headPosition())
        }
    };
}
