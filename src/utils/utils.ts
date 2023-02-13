import { createEffect } from 'solid-js';
import { createStore, SetStoreFunction, Store } from 'solid-js/store';
// @ts-ignore
import { v4 } from "uuid";

function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-');
}

function nextFrame(fn: () => void) {
  requestAnimationFrame(() => requestAnimationFrame(fn));
}

function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function getCID() {

  let cid;

  if (typeof window !== 'undefined') {
    cid = localStorage.getItem("cid")
  }

  if (cid === null) {
    let new_cid = v4();
    localStorage.setItem("cid", new_cid);
    return new_cid;
  } else {
    return cid;
  }
}

function createLocalStore<T extends {}>(
  name: string,
  init: T,
): [Store<T>, SetStoreFunction<T>] {

  let localState;

  if (typeof window !== 'undefined') {
      localState = localStorage.getItem(name);
  }


  const [state, setState] = createStore<T>(
    localState ? JSON.parse(localState) : init,
  );

  createEffect(() => localStorage.setItem(name, JSON.stringify(state)));

  return [state, setState];
}

export { slugify, shuffle, nextFrame, createLocalStore, getCID };
