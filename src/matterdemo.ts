import * as pixi from 'pixi.js';
import matter from 'matter-js';

export class MatterPhysicsDemo {
    private WIDTH = 640;
    private HEIGHT = 480;

    private app = new pixi.Application({
        width: this.WIDTH,
        height: this.HEIGHT
    });

    public run() {
        document.body.appendChild(this.app.view);
        const engine = matter.Engine.create();

        const ground = matter.Bodies.rectangle(0, 400, 800, 50, {isStatic: true});
        matter.World.add(engine.world, ground);

        const dude = new Dude();
        dude.loadAssets(this.app);
        dude.addPhysics(this.app, engine);

        this.app.ticker.add((elapsedFrames: number) => {
            const ms = this.app.ticker.elapsedMS;
            matter.Engine.update(engine, ms);
            dude.update(ms);
        });
    }
}

class Dude {
    public assetsLoaded = false;

    private sprite: pixi.Sprite;
    private physicsBody: matter.Body;

    public loadAssets(app: pixi.Application) {
        const loader = pixi.Loader.shared;
        loader.add('dude', 'img/hero.png').load((loader, resources) => {
            const sprite = new pixi.Sprite(resources.dude.texture);
            sprite.x = app.renderer.width / 2;
            sprite.y = app.renderer.height / 2;
            sprite.anchor.x = 0.5;
            sprite.anchor.y = 0.5;

            app.stage.addChild(sprite);
            this.sprite = sprite;

            this.assetsLoaded = true;
        });
    }

    public addPhysics = (app: pixi.Application, engine: matter.Engine) => {
        const x = app.renderer.width / 2;
        const y = app.renderer.height / 2;
        this.physicsBody = matter.Bodies.rectangle(x, y, 20, 20);
        matter.World.add(engine.world, this.physicsBody);
    }

    public update = (elapsedMs: number) => {
        if (this.assetsLoaded) {
            this.sprite.rotation += 0.05;
            this.sprite.x = this.physicsBody.position.x;
            this.sprite.y = this.physicsBody.position.y;
        }
    }
}
