import {Move} from "~/types/types";

function Ban(client : any, id : number) {
    const req : Move = {
        call: "BAN",
        data: id
    }
    client.send(JSON.stringify(req));
}

function Pick(client : any, id : number) {
    const req : Move = {
        call: "PICK",
        data: id
    }
    client.send(JSON.stringify(req));
}

export {Ban, Pick}