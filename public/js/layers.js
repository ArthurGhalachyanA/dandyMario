import TileResolver from "./TileResolver.js";

export function createBackgroundLayer(level, tiles, sprites){
    const resolver = new TileResolver(tiles);

    const buffer = document.createElement('canvas');
    buffer.width = 256 + 16;
    buffer.height = 240;

    const context = buffer.getContext('2d');

    function redraw(indexStart, indexEnd){
        context.clearRect(0, 0, buffer.width, buffer.height);

        for(let x = indexStart; x <= indexEnd; x++){
            const col = tiles.grid[x];
            if(col){
                col.forEach((tile, y) => {
                    if(sprites.animations.has(tile.name)){
                        sprites.drawAnim(tile.name, context, x - indexStart, y, level.totalTime);
                    }else{
                        sprites.drawTail(tile.name, context, x - indexStart, y);
                    }
                });
            }
        }
    }

    return function drawBackgroundLayer(context, camera){
        const drawWidth = resolver.toIndex(camera.size.x);
        const drawFrom = resolver.toIndex(camera.pos.x);
        const drawTo = drawFrom + drawWidth;

        redraw(drawFrom, drawTo);

        context.drawImage(buffer, -camera.pos.x % 16, -camera.pos.y);
    }
}

export function createCameraLayer(cameraToDraw){
    return function drawCameraLayer(context, cameraFrom){
        context.strokeStyle = 'purple';

        context.beginPath();
        context.rect(
            cameraToDraw.pos.x - cameraFrom.pos.x,
            cameraToDraw.pos.y - cameraFrom.pos.y,
            cameraToDraw.size.x,
            cameraToDraw.size.y
        );
        context.stroke();
    }
}

export function createSpriteLayer(entities, width = 64, height = 64){
    const spriteBuffer = document.createElement('canvas');
    spriteBuffer.width = width;
    spriteBuffer.height = height;

    const spriteBufferContext = spriteBuffer.getContext('2d');

    return function drawSpriteLayer(context, camera){
        entities.forEach(entity => {
            spriteBufferContext.clearRect(0, 0, width, height);

            entity.draw(spriteBufferContext);

            context.drawImage(
                spriteBuffer,
                entity.pos.x - camera.pos.x,
                entity.pos.y - camera.pos.y,
            );
        });
    }
}

export function createCollisionLayer(level){
    const resolvedTiles = [];
    const tileResolver = level.tileCollider.tiles;
    const tileSize = level.tileCollider.tiles.tileSize;

    const getByIndexOriginal = tileResolver.getByIndex;
    tileResolver.getByIndex = function getByIndexFake(x, y){
        resolvedTiles.push({x, y});
        return getByIndexOriginal.call(tileResolver, x, y);
    };

    return function drawCollision(context, camera){
        context.strokeStyle = 'blue';
        resolvedTiles.forEach(({x, y}) => {
            context.beginPath();
            context.rect(
                x*tileSize - camera.pos.x,
                y*tileSize - camera.pos.y,
                tileSize,
                tileSize
            );
            context.stroke();
        });

        context.strokeStyle = 'red';
        level.entities.forEach(entity => {
            context.beginPath();
            context.rect(
                entity.bounds.left - camera.pos.x,
                entity.bounds.top - camera.pos.y,
                entity.size.x,
                entity.size.y
            );
            context.stroke();
        });

        resolvedTiles.length = 0;
    }
}
