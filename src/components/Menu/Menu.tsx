import {createSignal} from "solid-js";
import "./Menu.css"
import "./AvatarPopup.css"
import AvatarPopup, {AvatarImage} from "~/components/Menu/AvatarPopup";
import {Avatars} from "~/data/avatars";
import {avatar} from "~/data/store";
import {GSForm} from "~/components/Menu/GameSettingPopup";
import Popup from "~/components/Popup/Popup";

export default function Menu(props: any) {
    const [nickname, setNickname] = createSignal("");
    const [avaPopUp, setAvaPopUp] = createSignal(false);
    const [gameSettingPopup, setGameSettingPopup] = createSignal(false);

    const watch : boolean = props.watch || false
    const create : boolean = props.create || false

    const joinGame = () => {
        const gid = props.gid;

        if (nickname() === "") {
            setNickname(props.player)
        }
        let url = `/game/${gid}?nickname=${nickname()}&ava=${avatar()}`
        if (watch) {
            url = `/watch/${gid}?nickname=${nickname()}`
        }

        window.location.href = url
    }

    return (
        <>
            <div class="container">
                {props.children}
                {
                    !watch &&
                    <>
                        <button onClick={() => setAvaPopUp(true)} class="ava_picker">
                            {AvatarImage(Avatars[avatar()])}
                            <span>Change Avatar</span>
                        </button>
                        <AvatarPopup trigger={avaPopUp()} setTrigger={setAvaPopUp}>
                        </AvatarPopup>
                    </>
                }
                <Popup active={gameSettingPopup()}>
                    <button onClick={() => setGameSettingPopup(false)} class="close_btn">╳</button>
                    <GSForm close={() => setGameSettingPopup(false)}/>
                </Popup>

                <div class="div">
                    <div class="inputBox">
                        <input
                            required
                            value={nickname()}
                            onInput={e => setNickname(e.currentTarget.value)}
                        />
                        <span>Nickname</span>
                    </div>

                    <button class="btn" onClick={() => joinGame()}>
                    { !watch &&
                        <span>Play</span>
                    }
                    { watch &&
                        <span>Watch</span>
                    }
                    <i></i></button>
                </div>
                {
                    create &&
                    <>
                        <button class="btn" onClick={() => setGameSettingPopup(true)}>
                            <span>Game Settings</span>
                        </button>
                    </>

                }
            </div>
        </>
    );
}