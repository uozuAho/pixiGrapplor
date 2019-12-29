export interface PhysicsEnvironment {
    addFixedRect(
        centerXpx: number,
        centerYpx: number,
        width: number,
        height: number
    ): void;
}
