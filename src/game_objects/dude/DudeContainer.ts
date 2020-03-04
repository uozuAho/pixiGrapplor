import * as pixi from 'pixi.js';
import { KeysDown } from "../../KeysDown";
import { PhysicsEnvironment } from "../../physics/PhysicsEnvironment";
import { Grapple } from "../grapple/Grapple";
import { IGameObject } from "../game_object";
import { DudeRenderer } from './DudeRenderer';
import { CircleRenderer } from '../../renderers/circle_renderer';
import { GrappleRenderer } from '../grapple/GrappleRenderer';
import { Dude } from './Dude';

export class DudeContainer implements IGameObject {

    private _dude: Dude;
    private _dudeRenderer: DudeRenderer;
    private _dudeDebugRenderer: CircleRenderer;
    private _grappleRenderer: GrappleRenderer;

    constructor(pixiApp: pixi.Application, physicsEnv: PhysicsEnvironment) {
        this._dude = new Dude(300, 350);
        this._dudeRenderer = new DudeRenderer(this._dude);
        this._dudeDebugRenderer = new CircleRenderer(pixiApp, 16);
        this._dudeRenderer.loadAssets(pixiApp);
        this._dude.addPhysics(physicsEnv);
        const grapple = new Grapple(physicsEnv);
        this._grappleRenderer = new GrappleRenderer(grapple, pixiApp);
        this._dude.setGrapple(grapple);
    }

    public update = (elapsedMs: number, keys: KeysDown) => {
        this._dude.update(elapsedMs, keys);
    };

    public render = () => {
        this._dudeRenderer.render();
        this._dudeDebugRenderer.render(this._dude.centerPx);
        this._grappleRenderer.render();
    };
}
