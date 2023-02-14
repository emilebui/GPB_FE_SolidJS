// All game logic is here

import {MsgType, Player, ResMessage} from "~/types/types";
import {parseResMsg} from "~/game/game_helper";
import {loading, p1Info, p2Info, setLoading, setP1Info, setp2Info, setPlayerTurn, setResMsg} from "~/game/game_state";

const handleMsg = (data : string) => {

    // Log
    console.log(`got reply ${data}`);


    // handle response message object
    const msg_obj = parseResMsg(data)
    processMsg(msg_obj)
    setResMsg(msg_obj)
    console.log(msg_obj)
}


const processMsg = (data : ResMessage) => {
    if (data.type >= MsgType.WAITING_PLAYER) {
        setLoading(false)
        return
    } else {
        setLoading(true)
    }

    let game_state = JSON.parse(data.data)
    console.log(game_state)

    // Update Game State
    PlayerUpdate(game_state)
}

const PlayerUpdate = (gs : any) => {

    // Update player 1
    if (p1Info.pid === "") {
        const pid = gs.player_turn_map[1]
        setP1Info("pid", pid)
        setP1Info("nickname", getNickname(pid, gs))
    }

    // Update player 2
    if (p2Info.pid === "") {
        const pid = gs.player_turn_map[2]
        setp2Info("pid", pid)
        setp2Info("nickname", getNickname(pid, gs))
    }

    setPlayerTurn(gs.player_turn)
}

function getNickname(cid : string, gs : any) {
    if (gs.player_1.cid !== cid) {
        return gs.player_2.nickname
    } else {
        return gs.player_1.nickname
    }
}

export {handleMsg}