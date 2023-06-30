import {createStore} from "solid-js/store";
import {ChatInfo, GameSetting, GenshinCharacter, Player, ResMessage, Side} from "~/types/types";
import {createSignal} from "solid-js";
import {MaxTimer} from "~/utils/const";

const DEFAULT_GAME_SETTING: GameSetting = {
    casual: false,
    ban_number: 4,
    delay: "0",
}

const EmptyMsg = {type: -1, data: "", message: "", info: null}
const EmptyPlayer = {pid: "", nickname: "", avatar: 1}

const [resMsg, setResMsg] = createStore<ResMessage>(EmptyMsg)
const [playerTurn, setPlayerTurn] = createSignal("")
const [loading, setLoading] = createSignal(false)

const [timer, setTimer] = createSignal(0)

const [delayTimer, setDelayTimer] = createSignal(0)
const [pick, setPick] = createSignal(false)

const [gameEnded, setGameEnded] = createSignal(false)

const [p1Info, setP1Info] = createStore<Player>({...EmptyPlayer, side: Side.LEFT})
const [p2Info, setp2Info] = createStore<Player>({...EmptyPlayer, side: Side.RIGHT})

const  [selectedCharacters, setSelectedCharacters] = createStore<GenshinCharacter['id'][]>([])
const [banlist1, setBanList1] = createStore<GenshinCharacter['id'][]>(Array.from({length: 1}))
const [banlist2, setBanList2] = createStore<GenshinCharacter['id'][]>(Array.from({length: 1}))
const [picklist1, setPickList1] = createStore<GenshinCharacter['id'][]>(Array.from({length: 8}))
const [picklist2, setPickList2] = createStore<GenshinCharacter['id'][]>(Array.from({length: 8}))

const [chatHistory, setChatHistory] = createStore<ChatInfo[]>([])

const [announceDisplay, setAnnounceDisplay] = createSignal(false)
const [annouceBody, setAnnounceBody] = createSignal((<></>))

const [gameSetting, setGameSetting] = createStore<GameSetting>(DEFAULT_GAME_SETTING)

export {
    resMsg,
    setResMsg,
    playerTurn,
    setPlayerTurn,
    loading,
    setLoading,
    p1Info,
    setP1Info,
    p2Info,
    setp2Info,
    banlist1,
    banlist2,
    picklist1,
    picklist2,
    setPickList2,
    setBanList1,
    setBanList2,
    setPickList1,
    selectedCharacters,
    setSelectedCharacters,
    pick,
    setPick,
    gameEnded,
    setGameEnded,
    timer,
    setTimer,
    chatHistory,
    setChatHistory,
    announceDisplay,
    annouceBody,
    setAnnounceBody,
    setAnnounceDisplay,
    gameSetting,
    setGameSetting,
    delayTimer,
    setDelayTimer
}