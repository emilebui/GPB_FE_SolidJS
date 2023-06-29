// All game logic is here

import {ChatInfo, GameStatus, MsgType, ResMessage} from "~/types/types";
import {parseResMsg} from "~/game/game_helper";
import {
    chatHistory,
    gameEnded,
    loading,
    p1Info,
    p2Info, pick, playerTurn, selectedCharacters,
    setBanList1, setBanList2, setChatHistory, setGameEnded,
    setLoading,
    setP1Info,
    setp2Info, setPick, setPickList1, setPickList2,
    setPlayerTurn,
    setResMsg, setSelectedCharacters, setTimer, timer,
    setGameSetting, banlist1, gameSetting, delayTimer, setDelayTimer
} from "~/game/game_state";
import {chosenCharacter, setTargetCard} from "~/data/store";
import {TargetCard2TurnMap} from "~/data/turn_info";
import {get_random, getCID, playSound} from "~/utils/utils";
import {annouceGameStarted, annoucePlayerTurn, notify} from "~/game/game_display";
import {characters} from "~/data/characters";
import {Ban, Pick} from "~/game/game_move";
import {MaxTimer} from "~/utils/const";

const handleMsg = (data: string) => {

    // handle response message object
    const msg_obj = parseResMsg(data)
    processMsg(msg_obj)
    // console.log(msg_obj)
}


const processMsg = (data: ResMessage) => {

    if (data.type >= MsgType.WAITING_PLAYER) {
        if (!gameEnded()) {
            setLoading(false)
        }
        setResMsg(data)
        return
    } else {
        if (data.type !== MsgType.LOG) {
            setLoading(true)
            setResMsg(data)
        }
    }

    if (data.type === MsgType.GAME_STATE_UPDATE) {
        GameStateUpdate(data)
    }

    if (data.type === MsgType.LOG) {
        UpdateChatLog(data)
    }

}

function UpdateChatLog(res: ResMessage) {
    let chat_info: ChatInfo = JSON.parse(res.data)
    setChatHistory([...chatHistory, chat_info])
}

function GameStateUpdate(res: ResMessage) {
    let game_state = JSON.parse(res.data)
    // console.log(game_state)

    // Update Game Setting
    GameSettingUpdate(game_state)

    // Update Player Info
    PlayerUpdate(game_state)

    // Update Board
    BoardUpdate(game_state)

    // Update Target Card
    TargetUpdate(game_state)

    // Update Selected Card
    SelectedCardUpdate(game_state)

    // Update Pick
    setPick(game_state.pick)

    // Game Notification
    GameNotification(game_state)

    // Update Game Ended
    GameEndUpdate(game_state)

    // Update Timer
    setGameTimer(game_state)
}

function setGameTimer(gs: any) {
    const game_delay = gs.settings.delay
    let new_game_check = checkNewGame(gs)

    if (!gs.settings.casual) {
        if (new_game_check) {
            setTimer(MaxTimer + 60)
        } else {
            if (game_delay > 0) {
                let delta_delay = game_delay * 20
                setDelayTimer(delta_delay)
                setTimer(MaxTimer + delta_delay)
            } else {
                setTimer(MaxTimer)
            }
        }
    } else if (!new_game_check && game_delay > 0) {
        setDelayTimer(game_delay * 20)
    }
}

function GameSettingUpdate(gs: any) {
    const num_ban = parseInt(gs.settings.num_ban)
    setGameSetting("ban_number", num_ban)

    if (banlist1.length != num_ban) {
        setBanList1(Array.from({length: num_ban}))
        setBanList2(Array.from({length: num_ban}))
    }
}

function GameEndUpdate(gs: any) {
    if (gs.status === GameStatus.ENDED) {
        setGameEnded(true)
    }
}

function SelectedCardUpdate(gs: any) {

    let new_selected_list;

    if (getCID() === p1Info.pid) {
        new_selected_list = Object.keys(gs.bp_map1).map(
            function (item) {
                return parseInt(item, 0)
            }
        );
    } else {
        new_selected_list = Object.keys(gs.bp_map2).map(
            function (item) {
                return parseInt(item, 0)
            }
        );
    }

    setSelectedCharacters(new_selected_list)
}

const TargetUpdate = (gs: any) => {
    const turn = gs.turn
    const format = gs.settings.num_ban
    // @ts-ignore
    const targetPos = TargetCard2TurnMap[format][turn]
    setTargetCard(targetPos)
}

const BoardUpdate = (gs: any) => {

    // Update p1_ban
    const p1_ban = gs.board.p_1_ban
    if (p1_ban) {
        setBanList1(createTeamArray(p1_ban, gameSetting.ban_number))
    }

    // Update p2_ban
    const p2_ban = gs.board.p_2_ban
    if (p2_ban) {
        setBanList2(createTeamArray(p2_ban, gameSetting.ban_number))
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

function createTeamArray(arr: number[], length: number) {
    const new_arr: number[] = Array.from({length: length})

    for (let i = 0; i < arr.length; i++) {
        new_arr[i] = arr[i]
    }

    return new_arr
}


const PlayerUpdate = (gs: any) => {

    // Update player 1
    if (p1Info.pid === "") {
        setP1Info("pid", gs.player_1.cid)
        setP1Info("nickname", gs.player_1.nickname)
        setP1Info("avatar", gs.player_1.avatar)
    }

    // Update player 2
    if (p2Info.pid === "") {
        setp2Info("pid", gs.player_2.cid)
        setp2Info("nickname", gs.player_2.nickname)
        setp2Info("avatar", gs.player_2.avatar)
    }

    setPlayerTurn(gs.player_turn)
}

function EnableBtn(b: boolean) {

    if (delayTimer() > 0) {
        return false
    }

    if (getCID() !== playerTurn()) {
        return false
    }

    if (selectedCharacters.includes(chosenCharacter())) {
        return false
    }

    return pick() === b;
}

const checkNewGame = (gs: any) => {
    return gs.turn === 1;
}


const UpdateGame = (player: string, gs: any) => {
    if (checkNewGame(gs)) {
        setTimeout(() => annouceGameStarted(player), 100)
    }
}

const GameNotification = (gs: any) => {
    if (loading() && !gameEnded()) {

        if (gs.status === GameStatus.ENDED) {
            notify("The Game has ended!")
            playSound("/sound/game_over.mp3")
            return
        }

        if (gs.player_turn === getCID()) {
            UpdateGame("You", gs)
            if (gs.pick) {
                notify("Your turn to pick!")
                playSound("/sound/you_pick.mp3")
            } else {
                notify("Your turn to ban!")
                playSound("/sound/you_ban.mp3")
            }

            // Update popup if delay
            let game_delay = gs.settings.delay
            if (!checkNewGame(gs) && game_delay > 0) {
                annoucePlayerTurn(gs.pick, game_delay * 1000)
            }

        } else {
            let nickname = p2Info.nickname
            if (gs.player_turn === p1Info.pid) {
                nickname = p1Info.nickname
            }
            UpdateGame(nickname, gs)
            if (gs.pick) {
                notify(`${nickname} turn to pick!`)
                playSound("/sound/enemy_pick.mp3")
            } else {
                notify(`${nickname} turn to ban!`)
                playSound("/sound/enemy_ban.mp3")
            }
        }
    }
}

const RandomMove = (client: any) => {
    if (loading() && !gameEnded() && playerTurn() == getCID()) {
        const unpicked_cards = characters.filter(card => !selectedCharacters.includes(card.id))
        const random_card = get_random(unpicked_cards)
        if (pick()) {
            Pick(client, random_card.id)
        } else {
            Ban(client, random_card.id)
        }
    }
}


const timeFlow = (client: any) => {
    if (loading() && !gameEnded()) {

        if (delayTimer() > 0) {
            setDelayTimer(delayTimer() - 1)
        }

        if (timer() > 0) {
            setTimer(timer() - 1)

            if (timer() === 0) {
                RandomMove(client)
            }
        }
    }
}


export {handleMsg, EnableBtn, timeFlow}