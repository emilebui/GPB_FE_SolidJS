// Error Message
import {Avatar, MsgType, Side} from "~/types/types";
import {Avatars} from "~/data/avatars";
import {getCID} from "~/utils/utils";
import styles from "~/components/App/App.module.css";
import {toast} from "solid-toast";
import {setAnnounceBody, setAnnounceDisplay} from "~/game/game_state";
import {JSX} from "solid-js";


const notify = (msg : string) => toast(msg, {
    duration: 5000,
    position: 'bottom-right',
    style: {
        'background-color': '#2d3861',
        'z-index': 3,
        'color': '#fff'
    }
});

const copyLink = (link : string) => {
    navigator.clipboard.writeText(link).then(
        () => notify("The link has been copied to clipboard.")
    )
}

const InfoMsg = (i: number, s: string, watch : boolean, gid? : string) => {
    switch (i) {
        default:
            return (
                <h1>Loading game...</h1>
            );
        case MsgType.WAITING_PLAYER:

            const join_link = `${import.meta.env.VITE_FE_URL}/join/${s}`
            const watch_link = `${import.meta.env.VITE_FE_URL}/spectate/${s}`

            return (
                <>
                    <h1>Waiting for the second player...</h1>
                    { !watch &&
                        <>
                            <h3>Click this link to copy and send it to the other player.</h3>
                            <a onClick={() => copyLink(join_link)} href="javascript:">
                                <h3>{join_link}</h3>
                            </a>
                        </>
                    }
                    <h4>To let others watch the game, click this link</h4>
                    <a onClick={() => copyLink(watch_link)} href="javascript:">
                        <h4>{watch_link}</h4>
                    </a>

                </>
            );
        case MsgType.JOIN_GAME_ERROR:
            return (
                <>
                    <h1>Failed to connect</h1>
                    <h3>{s}</h3>
                </>
            );
        case MsgType.DISCONNECT:
            const game_link = `${import.meta.env.VITE_FE_URL}/game/${gid}`

            return (
                <>
                    <h1>{s}</h1>
                    <h3>Send this link to that player for reconnection</h3>
                    <a onClick={() => copyLink(game_link)} href="javascript:">
                        <h3>{game_link}</h3>
                    </a>
                </>
            );
    }
}

// Avatar
const AvatarBox = (p : any, player_turn: string, watch : boolean) => {

    // @ts-ignore
    const ava : Avatar = Avatars.find(a => a.id === p.avatar)

    let who = "Opponent"


    if (getCID() === p.pid) {
        who = "You"
    }

    return (
        <div class={styles.avatar_box} classList={{
            [styles.float_left]: p.side === Side.LEFT,
            [styles.float_right]: p.side !== Side.LEFT,
        }}>
            {
                !watch &&
                <h2>{who}</h2>
            }
            <img class={styles.avatar_img}
                 classList={{
                     [styles.avatar_shadow]: p.pid === player_turn
                 }}
                 src={ava.path}
                 alt=""
            />
            <h1>{p.nickname}</h1>
        </div>
    );
}

const annouceGameStarted = ( player : string ) => {
    annouceContent(
        <>
            <h1>Game Started</h1>
            <h2>{`${player} will go first!!`}</h2>
        </>
    )
}

const annoucePlayerTurn = (pick: boolean, delay: number) => {
    annouceContent(
        <>
            {
                pick &&
                <h1>Your turn to pick</h1>
            }
            {
                !pick &&
                <h1>Your turn to ban</h1>
            }
        </>, delay
    )
}

const annouceContent = (body : JSX.Element, timer: number = 3000) => {
    setAnnounceBody(body)
    setAnnounceDisplay(true)
    setTimeout(() => setAnnounceDisplay(false), timer)
}

export {InfoMsg, AvatarBox, notify, annouceGameStarted, copyLink, annoucePlayerTurn}