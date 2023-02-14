import {createStore} from "solid-js/store";
import {GenshinCharacter, Player, ResMessage, Side} from "~/types/types";
import {createSignal} from "solid-js";

const EmptyMsg = {type: -1, data: "", message: "", info: null}
const EmptyPlayer = {pid: "", nickname: "", avatar: 1}

const [resMsg, setResMsg] = createStore<ResMessage>(EmptyMsg)
const [playerTurn, setPlayerTurn] = createSignal("")
const [loading, setLoading] = createSignal(false)

const [p1Info, setP1Info] = createStore<Player>({...EmptyPlayer, side: Side.LEFT})
const [p2Info, setp2Info] = createStore<Player>({...EmptyPlayer, side: Side.RIGHT})

const [banlist1, setBanList1] = createStore<GenshinCharacter['id'][]>(Array.from({length: 4}))
const [banlist2, setBanList2] = createStore<GenshinCharacter['id'][]>(Array.from({length: 4}))
const [picklist1, setPickList1] = createStore<GenshinCharacter['id'][]>(Array.from({length: 8}))
const [picklist2, setPickList2] = createStore<GenshinCharacter['id'][]>(Array.from({length: 8}))

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
    picklist2
}