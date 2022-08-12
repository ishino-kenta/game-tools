import { Item } from "@mirohq/websdk-types";
import { makeDeck } from "./app";

async function init() {
    miro.board.ui.on('icon:click', async () => {
        const selection: Item[] = await miro.board.getSelection();

        if (selection.length) {
            makeDeck(selection);
        } else {
            await miro.board.ui.openPanel({ url: 'panel.html' });
        }
    });
}

init();
