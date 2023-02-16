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

function playSound(path : string) {
  const audio = new Audio(path);
  audio.play().then(_ => {})
}

function get_random(list : any) {
  return list[Math.floor((Math.random()*list.length))];
}


export { slugify, shuffle, nextFrame, getCID, playSound, get_random };
