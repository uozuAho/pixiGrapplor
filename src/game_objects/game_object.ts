import { KeysDown } from "../KeysDown";

export interface IGameObject {
    update: (elapsedMs: number, keys: KeysDown) => void;
    render: () => void;
}

// export class GameObject {

//     _childObjects: GameObject[] = [];

//     public update = (elapsedMs: number, keys: KeysDown) => {
//         for (const object of this._childObjects) {
//             object.update(elapsedMs, keys);
//         }
//     }

//     public render = () => {
//         for (const object of this._childObjects) {
//             object.render();
//         }
//     }

//     public addChild = (object: GameObject) => {
//         this._childObjects.push(object);
//     }
// }
