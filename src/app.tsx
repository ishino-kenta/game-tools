import { Item, Rect, Shape } from "@mirohq/websdk-types";

export function makeDeck(selection: Item[]) {
    gather(selection);
    shuffle(selection);
    cover(selection);
}

async function gather(items: Item[]) {0
    let centerX: number = 0;
    let centerY: number = 0;

    for (let item of items) {
        if (isShape(item) || isImage(item)) {
                centerX = item.x;
                centerY = item.y;
            break;
        }
    }

    for (let item of items) {
        if (!isShape(item) && !isImage(item)) {
            return;
        }
        item.x = centerX;
        item.y = centerY;
        item.sync();
    }
}

function isShape(item: Item): item is Shape {
    if (!('type' in item)) {
        return false
    }
    return typeof item === 'object' &&
        item.type == 'shape';
}

function isImage(item: Item): item is Shape {
    if (!('type' in item)) {
        return false
    }
    return typeof item === 'object' &&
        item.type == 'image';
}

async function shuffle(items: Item[]) {
    for (let i = items.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        let tmp = items[i];
        items[i] = items[j];
        items[j] = tmp;
    }
    for (let item of items) {
        miro.board.bringToFront(item);
    }
}

async function cover(items: Item[]) {
    for (let sample of items) {
        if (isShape(sample) || isImage(sample)) {
            const shape: Shape = await miro.board.createShape({
                content: '<p>Deck of cards</p>',
                shape: 'rectangle',
                "style": {
                    "fillColor": "#13E3EB"
                },
                x: sample.x,
                y: sample.y + sample.height / 5,
                width: sample.width * 1.2,
                height: sample.height
            });

            miro.board.bringToFront(shape);
            break;
        }
    }
}
