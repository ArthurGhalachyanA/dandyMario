import {Trait, Sides} from "../Entity.js";

export default class PendulumWalk extends Trait {
    constructor() {
        super('pendulumWalk');

        this.speed = -30;
    }

    obstruct(entity, side){
        if(side === Sides.RIGHT || side === Sides.LEFT){
            this.speed = -this.speed;
        }
    }

    update(entity, deltaTime) {
        entity.vel.x = this.speed;
    }
}