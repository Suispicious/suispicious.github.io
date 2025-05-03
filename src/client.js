import { Transaction } from "@mysten/sui/transactions";
import config from "./config.js";

export class Client {
    constructor() {
        this.packageId = config.packageId;
    }

    sendMove(cap, row, col) {
        const tx = new Transaction();

        tx.moveCall({
            target: `${this.packageId}::chess::send_move`,
            arguments: [tx.object(cap.id.id), tx.pure.u8(row), tx.pure.u8(col)],
        });

        return tx;
    }

}