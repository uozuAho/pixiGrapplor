import matter from 'matter-js';
import { PhysicalObject } from '../PhysicalObject';

export class FixedRectangle implements PhysicalObject {
    public body: matter.Body;

    constructor(centerXpx: number, centerYpx: number, widthPx: number, heightPx: number) {
        this.body = matter.Bodies.rectangle(centerXpx, centerYpx, widthPx, heightPx, { isStatic: true });
    }
}
