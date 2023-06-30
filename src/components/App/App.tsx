import {Component, createSignal, For, onMount} from 'solid-js';
import styles from './App.module.css';
import {Card} from '../Card';
import {Button} from '../Button';
import {Container} from '../Container';
import {Filters} from '../Filters';
import {characters} from '~/data/characters';
import {
    chosenCharacter,
    filterElements,
    filterRarity,
    setChosenCharacter,
} from '~/data/store';
import {ChatInfo, GenshinElement, MsgType, ResMessage} from '~/types/types';
import {getCID, getLocalStorage, newCID} from '~/utils/utils';
import {LoadingMenu} from "~/components/App/LoadingMenu";
import {useParams} from "@solidjs/router";

// @ts-ignore
import {w3cwebsocket as WebSocket} from "websocket";
import {
    annouceBody,
    announceDisplay,
    banlist1,
    banlist2, chatHistory, delayTimer, gameEnded, gameSetting,
    loading,
    p1Info,
    p2Info,
    picklist1,
    picklist2,
    playerTurn,
    resMsg, setLoading,
    setResMsg, timer
} from "~/game/game_state";
import {AvatarBox, copyLink, InfoMsg} from "~/game/game_display";
import {EnableBtn, handleMsg, timeFlow} from "~/game/game_logic";
import {Ban, Chat, Pick} from "~/game/game_move";
import {Toaster} from "solid-toast";
import AnnoucePopup from "~/components/App/AnouncePopup";
import Footer from "~/components/Footer/Footer";


const id2Card = (id: number, index: number, offset: number = 0) => (
    <Card
        index={index + offset}
        character={characters.find(c => c.id === id)}
    />
);


interface AppProps {
    watch?: boolean;
}

const App: Component<AppProps> = (props) => {
    const params = useParams();
    const [chatExpand, setChatExpand] = createSignal(true)
    const [expandDisplay, setExpandDisplay] = createSignal(true)

    const gid = params.gameid
    let nickname = getLocalStorage("nickname")
    let cid = getCID()
    const ava = getLocalStorage("avatar")
    const casual = getLocalStorage("gs_casual_mode")
    const numBan = getLocalStorage("gs_num_ban")
    const delay = getLocalStorage("gs_delay")
    const watch: boolean = props.watch || false

    if (watch) {
        cid = newCID()
    }

    let ws_uri = `${import.meta.env.VITE_WS_URI}/play?gid=${gid}&cid=${cid}&nickname=${nickname}&avatar=${ava}&casual=${casual}&numban=${numBan}&delay=${delay}`
    if (watch) {
        ws_uri = `${import.meta.env.VITE_WS_URI}/watch?gid=${gid}&cid=${cid}&nickname=${nickname}`
    }


    const client = new WebSocket(ws_uri)


    const LoadingMenuContent = (resMsg: ResMessage) => {
        let msg = resMsg.message;
        if (resMsg.type === MsgType.WAITING_PLAYER) {
            msg = gid
        }
        if (resMsg.type === MsgType.DISCONNECT) {
            return InfoMsg(resMsg.type, msg, watch, gid)
        }
        return InfoMsg(resMsg.type, msg, watch)
    }

    setInterval(() => {
        timeFlow(client)
    }, 50);

    onMount(async () => {
        client.onopen = () => {
            console.log("Connected to the game!");
            client.send(JSON.stringify({
                call: "GET_STATE",
                data: ""
            }));
        };
        client.onmessage = (message: any) => {
            handleMsg(message.data)
        }
        client.onclose = () => {
            setResMsg({
                message: "Can't connect to server!",
                type: MsgType.JOIN_GAME_ERROR,
            })
            setLoading(false)
        }
        setInterval(
            () => {
                // Keep-alive ping
                client.send("")
            }, 15000
        );
    })


    const chat = (e: any) => {
        if (e.keyCode == 13 && e.shiftKey == false) {
            const msg = e.currentTarget.value.trim();
            Chat(client, msg)
            e.preventDefault()
            e.currentTarget.value = "";
        }
    }

    const expandChat = () => {
        setChatExpand(!chatExpand())
        if (chatExpand()) {
            setTimeout(() => setExpandDisplay(!expandDisplay()), 500)
        } else {
            setExpandDisplay(!expandDisplay())
        }
    }

    const chatRender = (info: ChatInfo) => (
        <div>
            {!info.join_chat &&
                <>
                <span classList={{
                    [styles.span_p1]: info.cid === p1Info.pid,
                    [styles.span_p2]: info.cid === p2Info.pid,
                    [styles.span_you]: cid === info.cid,
                }}
                >{info.nickname}</span>
                    {
                        cid === info.cid &&
                        <span> (You)</span>
                    }
                    <span>: {info.message}</span>
                </>
            }
            {
                info.join_chat &&
                <span>
                    {info.message}
                </span>
            }
        </div>
    );

    const copyWatchLink = () => {
        copyLink(`${import.meta.env.VITE_FE_URL}/spectate/${gid}`)
    }

    return (
        <>
            {loading() &&
                <main>
                    {
                        gameEnded() &&
                        <h1 class={`${styles.title} ${styles.game_ended}`}>The game has ended!</h1>
                    }
                    <AnnoucePopup active={announceDisplay()}>{annouceBody()}</AnnoucePopup>
                    <h1 class={styles.title}>Genshin Impact Ban Pick</h1>
                    <div class={styles.avatars_container}>
                        {AvatarBox(p1Info, playerTurn(), watch)}
                        {AvatarBox(p2Info, playerTurn(), watch)}
                    </div>
                    <div class={styles.chat_container}>
                        <div class={styles.chat_box}
                             classList={{
                                 [styles.expanded]: chatExpand()
                             }}
                        >
                            <div class={styles.chat_display}
                                 classList={{
                                     [styles.expanded]: expandDisplay()
                                 }}
                            >
                                <div class={styles.chat_div}
                                     classList={{
                                         [styles.chat_hidden]: !expandDisplay()
                                     }}>
                                    <div>
                                        <span>Click </span><a onClick={() => copyWatchLink()}
                                                              href="javascript:">here</a><span> to let other watch the game</span>
                                    </div>
                                    <For each={chatHistory}>{info => chatRender(info)}</For>
                                </div>
                            </div>
                            <textarea class={styles.chat_input} onKeyDown={e => chat(e)}/>
                        </div>
                        <button class={styles.chat_btn}
                                classList={{
                                    [styles.expanded]: chatExpand()
                                }}
                                onClick={() => expandChat()}>
                            {!expandDisplay() &&
                                <span>»</span>
                            }
                            {expandDisplay() &&
                                <span>«</span>
                            }
                        </button>
                    </div>
                    {
                        gameSetting.ban_number != 0 &&
                        <>
                            <h3 class={styles.title}>Ban List</h3>
                            <div class={styles.teams}>
                                <div class={`${styles.grid}`}
                                     classList={{
                                         [styles.team]: gameSetting.ban_number == 4,
                                         [styles.team3]: gameSetting.ban_number == 3,
                                         [styles.team2]: gameSetting.ban_number == 2,
                                         [styles.team1]: gameSetting.ban_number == 1
                                     }}
                                >
                                    <For each={banlist1}>{(id, i) => id2Card(id, i())}</For>
                                </div>
                                <div class={`${styles.timer2} ${styles.chat_hidden}`}>
                                    <p>Time Remaining</p>
                                </div>
                                <div class={`${styles.grid}`}
                                     classList={{
                                         [styles.team]: gameSetting.ban_number == 4,
                                         [styles.team3]: gameSetting.ban_number == 3,
                                         [styles.team2]: gameSetting.ban_number == 2,
                                         [styles.team1]: gameSetting.ban_number == 1
                                     }}
                                >
                                    <For each={banlist2}>{(id, i) => id2Card(id, i(), 4)}</For>
                                </div>
                            </div>
                        </>
                    }

                    <h3 class={styles.title}>Pick List</h3>
                    <div class={styles.teams}>
                        <div class={`${styles.grid} ${styles.team}`}>
                            <For each={picklist1}>{(id, i) => id2Card(id, i(), 8)}</For>
                        </div>
                        <div class={styles.timer2}
                             classList={{
                                 [styles.chat_hidden]: !(timer() > 0 && !gameEnded() && delayTimer() <= 0)
                             }}
                        >
                            <p>Time Remaining</p>
                            <h1>{Math.floor(timer() / 20) + 1}s</h1>
                        </div>
                        <div class={`${styles.grid} ${styles.team}`}>
                            <For each={picklist2}>{(id, i) => id2Card(id, i(), 16)}</For>
                        </div>
                    </div>
                    <Toaster/>
                    <div class={styles.buttons}>
                        <Button
                            secondary={!EnableBtn(false)}
                            onClick={
                                () => Ban(client, chosenCharacter())
                            }
                            disabled={!EnableBtn(false)}
                            classList={{
                                [styles.no_click]: !EnableBtn(false)
                            }}
                        >
                            BAN
                        </Button>
                        <Button
                            secondary={!EnableBtn(true)}
                            onClick={
                                () => Pick(client, chosenCharacter())
                            }
                            disabled={!EnableBtn(true)}
                            classList={{
                                [styles.no_click]: !EnableBtn(true)
                            }}
                        >PICK</Button>
                    </div>
                    <Container>
                        <Filters/>
                    </Container>
                    <div class={`${styles.grid} ${styles.mainGrid}`}>
                        <For
                            each={characters.filter(
                                character =>
                                    (filterElements.length === 0 ||
                                        filterElements.some(elem =>
                                            character.elements.includes(elem as GenshinElement),
                                        )) &&
                                    (filterRarity.length === 0 ||
                                        filterRarity.includes(character.stars)),
                            )}
                        >
                            {character => (
                                <Card
                                    onClick={() => {
                                        setChosenCharacter(character.id);
                                    }}
                                    character={character}
                                    disabled={watch}
                                />
                            )}
                        </For>
                    </div>
                    <Footer></Footer>
                </main>
            }
            {
                !loading() &&
                <>
                    <LoadingMenu>
                        {LoadingMenuContent(resMsg)}
                        <Toaster/>
                    </LoadingMenu>
                    <Footer Absolute={true}></Footer>
                </>
            }
        </>
    );
};

export {App};
