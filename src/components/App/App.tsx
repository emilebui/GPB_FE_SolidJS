import {Component, createSignal, For, onMount} from 'solid-js';
import styles from './App.module.css';
import {Card} from '../Card';
import {Button} from '../Button';
import {Container} from '../Container';
import {Filters} from '../Filters';
import {characters} from '~/data/characters';
import {
    filterElements,
    filterRarity,
    selectedCharacters,
    setSelectedCharacters,
    chosenCharacter,
    setChosenCharacter,
} from '~/data/store';
import {GenshinCharacter, GenshinElement, MsgType, ResMessage} from '~/types/types';
import {getCID, shuffle} from '~/utils/utils';
import {LoadingMenu} from "~/components/App/LoadingMenu";
import {useParams, useSearchParams} from "@solidjs/router";

// @ts-ignore
import {w3cwebsocket as WebSocket} from "websocket";
import {banlist1, banlist2, loading, p1Info, p2Info, picklist1, picklist2, playerTurn, resMsg} from "~/game/game_state";
import {AvatarBox, InfoMsg} from "~/game/game_display";
import {handleMsg} from "~/game/game_logic";

const idToCard =
    (offset: number = 0) =>
        (id: GenshinCharacter['id'], index: number) =>
            (
                <Card
                    index={index + offset}
                    character={characters.find(c => c.id === id)}
                />
            );


const App: Component = (props : any) => {
    const params = useParams();
    const [sparams, setSparams] = useSearchParams();

    const gid = params.gameid
    const nickname = sparams.nickname
    const cid = getCID()

    const ws_uri = `${import.meta.env.VITE_WS_URI}/play?gid=${gid}&cid=${cid}&nickname=${nickname}`
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


    const [teams, setTeams] = createSignal<GenshinCharacter['id'][]>([]);
    const areAllCharatersSelected = () =>
        selectedCharacters.selectedCharacters.length === characters.length;

    const generateTeams = () => {
        const rnd = shuffle(Array.from(selectedCharacters.selectedCharacters));
        setTeams(() => rnd.slice(0, 24));
    };

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
                            secondary
                            onClick={() =>
                                setSelectedCharacters(state => ({
                                    ...state,
                                    selectedCharacters: areAllCharatersSelected()
                                        ? []
                                        : characters.map(c => c.id),
                                }))
                            }
                        >
                            {areAllCharatersSelected() ? 'Deselect' : 'Select'} all
                        </Button>
                        <Button onClick={generateTeams}>Generate teams</Button>
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
