import {Trait} from "../Entity.js";

export default class Stomper extends Trait{
    constructor(){
        super('stomper');

        this.queueBounce = false;
        this.bounceSpead = 400;
    }

    bounce(){
        this.queueBounce = true;
    }

    update(entity) {
        if(this.queueBounce){
            entity.vel.y = -this.bounceSpead;
            this.queueBounce = false;
        }
    }
}