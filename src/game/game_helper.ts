import {ResMessage} from "~/types/types";

function parseResMsg(json : string) {
    const res: ResMessage = JSON.parse(json)
    return res
}





export {parseResMsg}