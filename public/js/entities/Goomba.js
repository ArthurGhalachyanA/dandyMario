import Entity from "../Entity.js";
import {loadSpriteSheet} from "../loaders.js";
import PendulumWalk from "../traits/PendulumWalk.js";
import Killable from "../traits/Killable.js";
import {Trait} from "../Entity.js";

export function loadGoomba(){
    return loadSpriteSheet('goomba')
        .then(createGoombaFactory);
}


class Behavior extends Trait{
    constructor(){
        super('behavior')
    }

    collides(us, them) {
        if(us.killable.dead){
            return;
        }


        if(them.stomper){
            if(them.vel.y > us.vel.y){
                us.killable.kill();
                them.stomper.bounce();
                us.pendulumWalk.speed = 0;
            }else{
                them.killable.kill();
            }

        }
    }
}

function createGoombaFactory(sprite){
    const runAnim = sprite.animations.get('walk');

    function routeFrame(goomba){
        if(goomba.killable.dead){
            return 'flat';
        }

        return runAnim(goomba.lifeTime)
    }

    function drawGoomba(context){
        sprite.draw(routeFrame(this), context, 0, 0);
    }

    return function createGoomba(){
        const goomba = new Entity();

        goomba.size.set(16, 16);
        goomba.addTrait(new PendulumWalk());
        goomba.addTrait(new Behavior());
        goomba.addTrait(new Killable());

        goomba.draw = drawGoomba;

        return goomba;
    }
}