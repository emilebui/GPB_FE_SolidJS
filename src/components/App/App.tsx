import {Component, For, onMount} from 'solid-js';
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
import {GenshinCharacter, GenshinElement, MsgType, ResMessage} from '~/types/types';
import {getCID} from '~/utils/utils';
import {LoadingMenu} from "~/components/App/LoadingMenu";
import {useParams, useSearchParams} from "@solidjs/router";

// @ts-ignore
import {w3cwebsocket as WebSocket} from "websocket";
import {banlist1, banlist2, loading, p1Info, p2Info, picklist1, picklist2, playerTurn, resMsg} from "~/game/game_state";
import {AvatarBox, InfoMsg} from "~/game/game_display";
import {EnableBtn, handleMsg} from "~/game/game_logic";
import {Ban, Pick} from "~/game/game_move";

const idToCard =
    (offset: number = 0) =>
        (id: GenshinCharacter['id'], index: number) =>
            (
                <Card
                    index={index + offset}
                    character={characters.find(c => c.id === id)}
                />
            );


const App: Component = () => {
    const params = useParams();
    const [sparams, _] = useSearchParams();

    const gid = params.gameid
    const nickname = sparams.nickname
    const cid = getCID()
    const ava = sparams.ava

    const ws_uri = `${import.meta.env.VITE_WS_URI}/play?gid=${gid}&cid=${cid}&nickname=${nickname}&avatar=${ava}`
    console.log(ws_uri)
    const client = new WebSocket(ws_uri)

    // Game display

    const LoadingMenuContent = (resMsg : ResMessage) => {
        let msg = resMsg.message;
        if (resMsg.type === MsgType.WAITING_PLAYER) {
            msg = `${import.meta.env.VITE_FE_URL}/join/${gid}`
        }
        return InfoMsg(resMsg.type, msg)
    }


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
    })


    return (
        <>
            {   loading() &&
                <main>
                    <h1 class={styles.title}>Genshin Impact Ban Pick</h1>
                    <div class={styles.avatars_container}>
                        {AvatarBox(p1Info, playerTurn())}
                        {AvatarBox(p2Info, playerTurn())}
                    </div>
                    <h3 class={styles.title}>Ban List</h3>
                    <div class={styles.teams}>
                        <div class={`${styles.grid} ${styles.team}`}>
                            {banlist1.map(idToCard())}
                        </div>
                        <div class={`${styles.grid} ${styles.team}`}>
                            {banlist2.map(idToCard(4))}
                        </div>
                    </div>
                    <h3 class={styles.title}>Pick List</h3>
                    <div class={styles.teams}>
                        <div class={`${styles.grid} ${styles.team}`}>
                            {picklist1.map(idToCard(8))}
                        </div>
                        <div class={`${styles.grid} ${styles.team}`}>
                            {picklist2.map(idToCard(16))}
                        </div>
                    </div>
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
                                />
                            )}
                        </For>
                    </div>
                </main>
            }
            {
                !loading() &&
                <LoadingMenu>
                    {LoadingMenuContent(resMsg)}
                </LoadingMenu>
            }
        </>
    );
};

export {App};
