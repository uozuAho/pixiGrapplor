import matter from 'matter-js';

export interface PhysicalObject {
    // todo: fix exposed matter internals
    body: matter.Body;
}
