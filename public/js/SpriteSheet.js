export default class SpriteSheet{

    constructor(image, width, height){
        this.image = image;
        this.width = width;
        this.height = height;
        this.tiles = new Map();
        this.animations = new Map();
    }


    defineAnim(name, animation){
        this.animations.set(name, animation);
    }

    define(name, x, y, width, height){
        const buffers = [false, true].map(flip => {
            const buffer = document.createElement('canvas');
            buffer.width = width;
            buffer.height = height;

            const context = buffer.getContext('2d');

            if(flip){
                context.scale(-1, 1);
                context.translate(-width, 0);
            }

            context.drawImage(this.image,
                x, //vortexic sksac ktri nkar@ x
                y, //vortexic sksac ktri nkar@ x
                width, //minchev inchqan ktri x
                height, //minchev inchqan ktri y
                0, //vortexic sksac nkari x context
                0, //vortexic sksac nkari y context
                width, //inchqani vra nkari lriv buffer@ ankax ira chapic x
                height //inchqani vra nkari lriv buffer@ ankax ira chapic y
            );

            return buffer;
        });

        this.tiles.set(name, buffers);
    }

    defineTile(name, x, y){
        this.define(name, x * this.width, y * this.height, this.width, this.height)
    }

    drawAnim(name, context, x, y, distance){
        this.drawTail(this.animations.get(name)(distance), context, x, y)
    }

    draw(name, context, x, y, flip = false){
        const buffer = this.tiles.get(name)[flip ? 1: 0];
        context.drawImage(buffer, x, y);
    }

    drawTail(name, context, x, y){
        this.draw(name, context, x * this.width, y * this.height)
    }
}