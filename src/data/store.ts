import {createStore} from 'solid-js/store';
import {createSignal} from "solid-js";

const [filterElements, setFilterElements] = createStore<string[]>([]);

const [filterRarity, setFilterRarity] = createStore<number[]>([]);

const [filterWeapons, setFilterWeapons] = createStore<string[]>([]);

const [filterGender, setFilterGender] = createStore<string[]>([]);

const [chosenCharacter, setChosenCharacter] = createSignal(0)

const [targetCard, setTargetCard] = createSignal(0)

const [nickname, setNickname] = createSignal("")
const [avatar, setAvatar] = createSignal(0)

export {
    filterElements,
    setFilterElements,
    filterRarity,
    setFilterRarity,
    filterWeapons,
    setFilterWeapons,
    filterGender,
    setFilterGender,
    chosenCharacter,
    setChosenCharacter,
    targetCard,
    setTargetCard,
    setAvatar,
    setNickname,
    avatar,
    nickname
};
