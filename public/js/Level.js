import Compositor from "./Compositor.js";
import TileCollider from './TileCollider.js';
import EntityCollider from './EntityCollider.js';

export default class Level{
    constructor(){
        this.gravity = 1500;
        this.totalTime = 0;

        this.comp = new Compositor();
        this.entities = new Set();

        this.entityCollider = new EntityCollider(this.entities);
        this.tileCollider = null;
    }

    setTileCollider(matrix){
        this.tileCollider = new TileCollider(matrix);
    }

    update(deltaTime){
        this.entities.forEach(entity => {
            entity.update(deltaTime, this);

            entity.pos.y += entity.vel.y * deltaTime;
            this.tileCollider.checkY(entity);

            entity.pos.x += entity.vel.x * deltaTime;
            this.tileCollider.checkX(entity);

            entity.vel.y += this.gravity * deltaTime;
        });

        this.entities.forEach(entity => {
            this.entityCollider.check(entity);
        });

        this.totalTime += deltaTime;
    }
}