export type GenshinElement =
    | 'anemo'
    | 'cryo'
    | 'dendro'
    | 'electro'
    | 'geo'
    | 'hydro'
    | 'pyro';

export type GenshinWeapon =
    | 'bow'
    | 'catalyst'
    | 'claymore'
    | 'polearm'
    | 'sword';

export type Gender = 'F' | 'M';

export interface GenshinCharacter {
    id: number;
    fullName: string;
    shortName: string;
    stars: 4 | 5;
    elements: GenshinElement[];
    weapon: GenshinWeapon;
    gender: Gender[];
    selected: boolean;
    collab: boolean;
}

export interface GameSetting {
    casual: boolean;
    ban_number: number;
    so_mode: boolean;
    delay: string;
}


export interface Avatar {
    id: number;
    name: string;
    path: string;
}

export enum GameStatus {
    WAITING,
    PLAYING,
    ENDED,
    HALT
}

export enum MsgType {
    GAME_STATE_UPDATE,
    LOG,
    MOVE_ERROR,
    RECONNECT,
    WAITING_PLAYER,
    DISCONNECT,
    JOIN_GAME_ERROR,
}

export enum Side {
    LEFT,
    RIGHT
}

export interface ResMessage {
    message: string;
    type: number;
    data: string;
    info: any;
}

export interface Player {
    pid: string;
    nickname: string;
    avatar: number;
    side: number;
}

export interface Move {
    call: string;
    data: any;
}

export interface ChatInfo {
    message: string;
    cid: string;
    nickname: string;
    join_chat: boolean;
}