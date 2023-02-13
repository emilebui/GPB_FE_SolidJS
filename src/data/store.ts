import {createLocalStore} from '~/utils/utils';
import {GenshinCharacter} from '~/types/types';
import {createStore} from 'solid-js/store';
import {createSignal} from "solid-js";

const preselectedCharacters: GenshinCharacter['id'][] = [];

const [filterElements, setFilterElements] = createStore<string[]>([]);

const [filterRarity, setFilterRarity] = createStore<number[]>([]);

const [selectedCharacters, setSelectedCharacters] = createLocalStore(
    'selectedCharacters',
    {
        selectedCharacters: preselectedCharacters,
    },
);

const [chosenCharacter, setChosenCharacter] = createSignal(0)

const [targetCard, setTargetCard] = createSignal(0)

export {
    selectedCharacters,
    setSelectedCharacters,
    filterElements,
    setFilterElements,
    filterRarity,
    setFilterRarity,
    chosenCharacter,
    setChosenCharacter,
    targetCard,
    setTargetCard,
};
