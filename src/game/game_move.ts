import {Move} from "~/types/types";
import {setTimer} from "~/game/game_state";

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

function Chat(client : any, msg : string) {
    const req : Move = {
        call: "CHAT",
        data: msg
    }
    client.send(JSON.stringify(req))
}

export {Ban, Pick, Chat}