// Error Message
import {Avatar, MsgType, Side} from "~/types/types";
import {Avatars} from "~/data/avatars";
import {getCID} from "~/utils/utils";
import styles from "~/components/App/App.module.css";

const InfoMsg = (i: number, s: string) => {
    switch (i) {
        default:
            return (
                <h1>Loading game...</h1>
            );
        case MsgType.WAITING_PLAYER:
            return (
                <>
                    <h1>Waiting for other player...</h1>
                    <h3>Send this link to other player to join</h3>
                    <h4>{s}</h4>
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
const AvatarBox = (p : any, player_turn: string) => {

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
            <h1>{who}</h1>
            <img class={styles.avatar_img}
                 classList={{
                     [styles.avatar_shadow]: p.pid === player_turn
                 }}
                 src={ava.path}
                 alt=""
            />
            <h2>{p.nickname}</h2>
        </div>
    );
}

export {InfoMsg, AvatarBox}