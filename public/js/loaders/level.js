import Level from "../Level.js";
import {createBackgroundLayer, createSpriteLayer} from "../layers.js";
import {loadSpriteSheet, loadJSON} from "../loaders.js";
import {Matrix} from "../math.js";

function setupCollision(levelSpec, level){
    const mergedTiles = levelSpec.layers.reduce((mergedTiles, layerSpec) => {
        return mergedTiles.concat(layerSpec.tiles);
    }, []);
    const collisionGrid = createCollisionGrid(mergedTiles, levelSpec.patterns);
    level.setTileCollider(collisionGrid);
}

function setupBackgrounds(levelSpec, level, tileSprites){
    levelSpec.layers.forEach(layer => {
        const backgroundGrid = expandBackgroundGrid(layer.tiles, levelSpec.patterns);
        const backgroundLayer = createBackgroundLayer(level, backgroundGrid, tileSprites);
        level.comp.layers.push(backgroundLayer);
    });
}

function setupEntities(LevelSpec, level, entityFactory){
    LevelSpec.entities.forEach(({name, pos: [x, y]}) => {
        const createEntity = entityFactory[name];
        const entity = createEntity();
        entity.pos.set(x, y);
        level.entities.add(entity);
    });

    const spriteLayer = createSpriteLayer(level.entities);
    level.comp.layers.push(spriteLayer);
}

function* expandSpan(xStart, xLen, yStart, yLen){
    const xEnd = xStart + xLen;
    const yEnd = yStart + yLen;
    for(let x = xStart; x < xEnd; x++) {
        for (let y = yStart; y < yEnd; y++) {
            yield {x, y};
        }
    }
}

function expandRange(range){
    if(range.length === 4){
        const [xStart, xLen, yStart, yLen] = range;
        return expandSpan(xStart, xLen, yStart, yLen)
    }else if(range.length === 3){
        const [xStart, xLen, yStart] = range;
        return expandSpan(xStart, xLen, yStart, 1)
    }else if(range.length === 2){
        const [xStart, yStart] = range;
        return expandSpan(xStart, 1, yStart, 1)
    }
}

function* expandRanges(ranges){
    for(const range of ranges){
        yield* expandRange(range);
    }
}

function* createTiles(tiles, patterns){
    function* walkTiles(tiles, offsetX, offsetY){
        for(const tile of tiles){
            for(const {x, y} of expandRanges(tile.ranges)){
                const derivedX = x + offsetX;
                const derivedY = y + offsetY;
                if(tile.pattern){
                    const tiles = patterns[tile.pattern].tiles;
                    yield* walkTiles(tiles, derivedX, derivedY);
                }else{
                    yield {
                        tile: tile,
                        x: derivedX,
                        y: derivedY
                    };
                }
            }
        }
    }

    yield* walkTiles(tiles, 0, 0);
}


function createCollisionGrid(tiles, patterns){
    const grid = new Matrix();

    for(const {tile, x, y} of createTiles(tiles, patterns)){
        grid.set(x, y, {type: tile.type});
    }

    return grid;
}

function expandBackgroundGrid(tiles, patterns){
    const grid = new Matrix();

    for(const {tile, x, y} of createTiles(tiles, patterns)){
        grid.set(x, y, {name: tile.name});
    }

    return grid;
}

export function createLoadLevel(entityFactory) {
    return function loadLevel(name){
        return loadJSON(`/levels/${name}.json`)
            .then(levelSpec => Promise.all([
                levelSpec,
                loadSpriteSheet(levelSpec.spriteSheet)
            ]).then(([levelSpec, tileSprites]) => {
                const level = new Level();

                setupCollision(levelSpec, level);

                setupBackgrounds(levelSpec, level, tileSprites);

                setupEntities(levelSpec, level, entityFactory);

                return level;
            }));
    }
}