import {createSignal, onMount} from "solid-js";
import "./Counter.css";
// @ts-ignore
import { w3cwebsocket as WebSocket } from "websocket";
// @ts-ignore
import { v4 } from "uuid";

const client = new WebSocket('ws://127.0.0.1:8000')

export default function Counter() {
  const [count, setCount] = createSignal(0);
  const [msg, setMsg] = createSignal("test");

  let btnClicked = () => {
    setCount(count() + 1)
    client.send(JSON.stringify({
      type: "message",
      msg: v4()
    }));
  }

  onMount(async () => {
    client.onopen = () => {
      console.log('Websocket connected');
    };
    client.onmessage = (message : any) => {
      console.log(`got reply ${message}`);
      setMsg(message.data);
    }
  })

  setInterval( () => {
    setCount(count() + 1)
  }, 1000);

  // createEffect(() => {
  //   console.log(msg());
  // })

  return (
      <button class="increment" onClick={() => btnClicked()}>
        Clicks: {count()}, Message: {msg()}
      </button>
  );
}
