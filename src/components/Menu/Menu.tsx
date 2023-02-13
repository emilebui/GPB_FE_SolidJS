import {createSignal} from "solid-js";
import "./Menu.css"

export default function Menu(props : any) {
    const [ nickname, setNickname ] = createSignal("");
    const joinGame = () => {
        const gid = props.gid;

        if (nickname() === "") {
            setNickname(props.player)
        }
        window.location.href = `/game/${gid}?nickname=${nickname()}`
    }

    return (
        <>
            <div class="container">
                {props.children}
                <div class="div">
                    <div class="inputBox">
                        <input
                            required
                            value={nickname()}
                            onInput={e => setNickname(e.currentTarget.value)}
                        />
                        <span>Nickname</span>
                    </div>

                    <button class="btn" onClick={() => joinGame()}><span>Play</span><i></i></button>
                </div>
            </div>
        </>
    );
}