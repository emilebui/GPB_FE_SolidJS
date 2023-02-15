import {createSignal} from "solid-js";
import "./Menu.css"
import "./AvatarPopup.css"
import AvatarPopup, {AvatarImage} from "~/components/Menu/AvatarPopup";
import {Avatars} from "~/data/avatars";
import {avatar} from "~/data/store";

export default function Menu(props: any) {
    const [nickname, setNickname] = createSignal("");
    const [avaPopUp, setAvaPopUp] = createSignal(false);

    const joinGame = () => {
        const gid = props.gid;

        if (nickname() === "") {
            setNickname(props.player)
        }
        window.location.href = `/game/${gid}?nickname=${nickname()}&ava=${avatar()}`
    }

    return (
        <>
            <div class="container">
                {props.children}
                <button onClick={() => setAvaPopUp(true)} class="ava_picker">
                    {AvatarImage(Avatars[avatar()])}
                    <span>Change Avatar</span>
                </button>
                <AvatarPopup trigger={avaPopUp()} setTrigger={setAvaPopUp}>
                </AvatarPopup>
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