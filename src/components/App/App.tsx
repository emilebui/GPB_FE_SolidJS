import {Component, createSignal, For, onMount} from 'solid-js';
import styles from './App.module.css';
import { Card } from '../Card';
import { Button } from '../Button';
import { Container } from '../Container';
import { Filters } from '../Filters';
import { characters } from '~/data/characters';
import {
  filterElements,
  filterRarity,
  selectedCharacters,
  setSelectedCharacters,
  chosenCharacter,
  setChosenCharacter,
} from '~/data/store';
import { GenshinCharacter, GenshinElement } from '~/types/types';
import {getCID, shuffle} from '~/utils/utils';
import {LoadingMenu} from "~/components/App/LoadingMenu";
import {useParams, useSearchParams} from "@solidjs/router";

// @ts-ignore
import { w3cwebsocket as WebSocket } from "websocket";

const idToCard =
  (offset: number = 0) =>
  (id: GenshinCharacter['id'], index: number) =>
    (
      <Card
        index={index + offset}
        character={characters.find(c => c.id === id)}
      />
    );

// Error Message
const InfoMsg = (i : number, s : string) => {
  switch (i) {
    case 0:
      return (
        <>
          <h1>Waiting for other player...</h1>
          <h3>Send this link to other player to join</h3>
          <h4>${s}</h4>
        </>
      );
    case 1:
      return (
          <>
            <h1>Failed to connect</h1>
            <h3>${s}</h3>
          </>
      );
    case 2:
      return (
          <>
            <h1>${s}</h1>
          </>
      );
  }
}



const App: Component = () => {
  const params = useParams();
  const [sparams, setSparams] = useSearchParams();
  const [loading, setLoading] = createSignal(false)
  const [infoMsg, setInfoMsg] = createSignal(0)
  const [msg, setMsg] = createSignal("");

  const gid = params.gameid
  const nickname = sparams.nickname
  const cid = getCID()

  const ws_uri = `${import.meta.env.VITE_WS_URI}/play?gid=${gid}&cid=${cid}&nickname=${nickname}`
  console.log(ws_uri)
  const client = new WebSocket(ws_uri)

  // Game logic
  const processMsg = (msg : string) => {
    console.log(`got reply ${msg}`);
    setMsg(msg);
  }


  onMount(async () => {
    client.onopen = () => {
      console.log("Connected to the game!");
    };
    client.onmessage = (message : any) => {
      console.log(`got reply ${message}`);
      processMsg(message.data)
    }
  })


  const [teams, setTeams] = createSignal<GenshinCharacter['id'][]>([]);
  const areAllCharatersSelected = () =>
    selectedCharacters.selectedCharacters.length === characters.length;

  const banlist1 = () => Array.from({ length: 4 }, (_, i) => teams()[i]);
  const banlist2 = () => Array.from({ length: 4 }, (_, i) => teams()[i + 4]);

  const picklist1 = () => Array.from({ length: 8 }, (_, i) => teams()[i + 8]);
  const picklist2 = () => Array.from({ length: 8 }, (_, i) => teams()[i + 16]);
  const generateTeams = () => {
    const rnd = shuffle(Array.from(selectedCharacters.selectedCharacters));
    setTeams(() => rnd.slice(0, 24));
  };

  return (loading()) ? (
    <>
      <main>
        <h1 class={styles.title}>Genshin Impact Ban Pick</h1>
        <h3 class={styles.title}>Ban List</h3>
        <div class={styles.teams}>
          <div class={`${styles.grid} ${styles.team}`}>
            {banlist1().map(idToCard())}
          </div>
          <div class={`${styles.grid} ${styles.team}`}>
            {banlist2().map(idToCard(4))}
          </div>
        </div>
        <h3 class={styles.title}>Pick List</h3>
        <div class={styles.teams}>
          <div class={`${styles.grid} ${styles.team}`}>
            {picklist1().map(idToCard(8))}
          </div>
          <div class={`${styles.grid} ${styles.team}`}>
            {picklist2().map(idToCard(16))}
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
          <Filters />
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
    </>
  ) : <LoadingMenu>
    <h1>Loading game...</h1>



  </LoadingMenu>;
};

export { App };
