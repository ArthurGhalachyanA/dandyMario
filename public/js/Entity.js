import {Vec2} from './math.js';
import BoundingBox from './BoundingBox.js';

export const Sides = {
    TOP: Symbol('top'),
    BOTTOM: Symbol('bottom'),
    LEFT: Symbol('left'),
    RIGHT: Symbol('right'),
};

export class Trait{
    constructor(name){
        this.NAME = name;
    }

    collides(us, them){

    }

    obstruct(){

    }

    update(){

    }
}

export default class Entity{
    constructor(){
        this.pos = new Vec2(0, 0);
        this.vel = new Vec2(0, 0);
        this.size = new Vec2(0, 0);
        this.offset = new Vec2(0, 0);
        this.bounds = new BoundingBox(this.pos, this.size, this.offset);
        this.lifeTime = 0;

        this.traits = [];
    }

    addTrait(trait){
        this[trait.NAME] = trait;
        this.traits.push(trait);
    }

    collides(candidate){
        this.traits.forEach(trait => {
            trait.collides(this, candidate)
        });
    }

    obstruct(side){
        this.traits.forEach(trait => {
            trait.obstruct(this, side)
        });
    }

    update(deltaTime, level){
        this.traits.forEach(trait => {
            trait.update(this, deltaTime, level);
        });

        this.lifeTime += deltaTime;
    }
}
