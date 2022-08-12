import { Item, Rect, Shape } from "@mirohq/websdk-types";

export function makeDeck(selection: Item[]) {
    gather(selection);
    shuffle(selection);
    cover(selection);
}

async function gather(items: Item[]) {
    const viewport: Rect = await miro.board.viewport.get();
    const centerX = viewport.x + viewport.width / 2;
    const centerY = viewport.y + viewport.height / 2;

    for (let item of items) {
        if (!isShape(item) && !isImage(item)) {
            return;
        }
        item.x = centerX - item.width / 2;
        item.y = centerY - item.height / 2;
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
    const viewport: Rect = await miro.board.viewport.get();
    const centerX = viewport.x + viewport.width / 2;
    const centerY = viewport.y + viewport.height / 2;

    for (let item of items) {
        if (isShape(item) || isImage(item)) {
            const sample: Shape = item;
            const width: number = sample.width * 1.2;
            const height: number = sample.height;
            const x: number = centerX - width / 2 + sample.width * 0.1;
            const y: number = centerY - height / 3

            const shape: Shape = await miro.board.createShape({
                content: '<p>Deck of cards</p>',
                shape: 'rectangle',
                "style": {
                    "fillColor": "#13E3EB"
                },
                x: x,
                y: y,
                width: width,
                height: height
            });

            miro.board.bringToFront(shape);
        }
        break;
    }
}
