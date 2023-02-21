// Error Message
import {Avatar, MsgType, Side} from "~/types/types";
import {Avatars} from "~/data/avatars";
import {getCID} from "~/utils/utils";
import styles from "~/components/App/App.module.css";
import {toast} from "solid-toast";


const notify = (msg : string) => toast(msg, {
    duration: 5000,
    position: 'bottom-right',
    style: {
        'background-color': '#2d3861',
        'z-index': 3,
        'color': '#fff'
    }
});


const InfoMsg = (i: number, s: string, watch : boolean) => {
    switch (i) {
        default:
            return (
                <h1>Loading game...</h1>
            );
        case MsgType.WAITING_PLAYER:
            return (
                <>
                    <h1>Waiting for other player...</h1>
                    { !watch &&
                        <>
                            <h3>Send this link to other player to join</h3>
                            <h3>{`${import.meta.env.VITE_FE_URL}/join/${s}`}</h3>
                        </>
                    }
                    <h4>To let other watch the game, use this link</h4>
                    <h4>{`${import.meta.env.VITE_FE_URL}/spectate/${s}`}</h4>
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
            return (
                <>
                    <h1>{s}</h1>
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

export {InfoMsg, AvatarBox, notify}