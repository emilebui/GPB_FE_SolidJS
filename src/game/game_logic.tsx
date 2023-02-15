// All game logic is here

import {MsgType, Player, ResMessage} from "~/types/types";
import {parseResMsg} from "~/game/game_helper";
import {
    loading,
    p1Info,
    p2Info, pick, playerTurn, selectedCharacters,
    setBanList1, setBanList2,
    setLoading,
    setP1Info,
    setp2Info, setPick, setPickList1, setPickList2,
    setPlayerTurn,
    setResMsg, setSelectedCharacters
} from "~/game/game_state";
import {chosenCharacter, setTargetCard} from "~/data/store";
import {TargetCard2TurnMap} from "~/data/turn_info";
import {getCID} from "~/utils/utils";

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

    GameStateUpdate(data)
}

function GameStateUpdate(res : ResMessage) {
    let game_state = JSON.parse(res.data)
    console.log(game_state)

    // Update Player Info
    PlayerUpdate(game_state)

    // Update Board
    BoardUpdate(game_state)

    // Update Target Card
    TargetUpdate(game_state)

    // Update Selected Card
    SelectedCardUpdate(game_state)

    //Update Pick
    setPick(game_state.pick)
}

function SelectedCardUpdate(gs :any) {
    const new_selected_list = Object.keys(gs.bp_map).map(
        function(item) {
            return parseInt(item, 0)
        }
    );
    setSelectedCharacters(new_selected_list)
}

const TargetUpdate = (gs : any) => {
    const turn = gs.turn
    // @ts-ignore
    const targetPos = TargetCard2TurnMap[turn]
    setTargetCard(targetPos)
}

const BoardUpdate = (gs : any) => {

    // Update p1_ban
    const p1_ban = gs.board.p_1_ban
    if (p1_ban) {
        setBanList1(createTeamArray(p1_ban, 4))
    }

    // Update p2_ban
    const p2_ban = gs.board.p_2_ban
    if (p2_ban) {
        setBanList2(createTeamArray(p2_ban, 4))
    }

    // Update p1_pick
    const p1_pick = gs.board.p_1_pick
    if (p1_pick) {
        setPickList1(createTeamArray(p1_pick, 8))
    }

    // Update p1_pick
    const p2_pick = gs.board.p_2_pick
    if (p2_pick) {
        setPickList2(createTeamArray(p2_pick, 8))
    }
}

function createTeamArray(arr : number[], length : number) {
    const new_arr : number[] = Array.from({length: length})

    for (let i = 0; i < arr.length; i++) {
        new_arr[i] = arr[i]
    }

    return new_arr
}


const PlayerUpdate = (gs : any) => {

    // Update player 1
    if (p1Info.pid === "") {
        const pid = gs.player_turn_map[1]
        setP1Info("pid", pid)
        const info = getPlayerInfo(pid, gs)
        console.log(info)
        setP1Info("nickname", info.nickname)
        setP1Info("avatar", info.avatar)
    }

    // Update player 2
    if (p2Info.pid === "") {
        const pid = gs.player_turn_map[2]
        setp2Info("pid", pid)
        const info = getPlayerInfo(pid, gs)
        console.log(info)
        setp2Info("nickname", info.nickname)
        setp2Info("avatar", info.avatar)
    }

    setPlayerTurn(gs.player_turn)
}

function getPlayerInfo(cid : string, gs : any) {
    if (gs.player_1.cid !== cid) {
        return {
            nickname: gs.player_2.nickname,
            avatar: gs.player_2.avatar
        }
    } else {
        return {
            nickname: gs.player_1.nickname,
            avatar: gs.player_1.avatar
        }
    }
}

function EnableBtn(b : boolean) {

    if (getCID() !== playerTurn()) {
        return false
    }

    if (selectedCharacters.includes(chosenCharacter())) {
        return false
    }

    return pick() === b;
}



export {handleMsg, EnableBtn}