import KeyboardState from './KeyboardState.js';

export function setupKeyboard(mario){
    const input = new KeyboardState();

    input.addMapping('KeyP', (keyState) => {
        if(keyState === 1){
            mario['jump'].start();
        }else{
            mario['jump'].cancel();
        }
    });

    input.addMapping('KeyO', (keyState) => {
        mario.turbo(keyState);
    });

    input.addMapping('KeyD', (keyState) => {
        mario['go'].dir += keyState ? 1: -1;
    });

    input.addMapping('KeyA', (keyState) => {
        mario['go'].dir += keyState ? -1: 1;
    });

    return input;
}