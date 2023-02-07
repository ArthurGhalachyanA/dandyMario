import Entity from "../Entity.js";
import PendulumWalk from "../traits/PendulumWalk.js";
import {loadSpriteSheet} from "../loaders.js";

export function loadKoopa(){
    return loadSpriteSheet('koopa')
        .then(createKoopaFactory);
}

function createKoopaFactory(sprite){
    const runAnim = sprite.animations.get('walk');

    function drawKoopa(context, t){
        sprite.draw(runAnim(this.lifeTime), context, 0, 0, this.vel.x < 0);
    }

    return function createKoopa(){
        const koopa = new Entity();

        koopa.size.set(16, 16);
        koopa.offset.y = 8;
        koopa.addTrait(new PendulumWalk());

        koopa.draw = drawKoopa;

        return koopa;
    }
}