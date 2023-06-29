import {Component, createEffect, createSignal} from "solid-js";
import "./GameSettingPopup.css"
import {gameSetting, setGameSetting} from "~/game/game_state";
import {Select} from "@thisbeyond/solid-select";
import "@thisbeyond/solid-select/style.css";

interface GSInterface {
    close: any
}

const GSForm: Component<GSInterface> = props => {

    const [banNumber, setBanNumber] = createSignal(0)
    const [casual, setCasual] = createSignal(true)
    const [delay, setDelay] = createSignal("0")

    createEffect(
        () => {
            setBanNumber(gameSetting.ban_number)
            setCasual(gameSetting.casual)
        }
    )

    const update_setting = () => {
        let temp_bn = banNumber()
        let temp_c = casual()
        let temp_d = delay()
        setGameSetting("casual", temp_c)
        setGameSetting("ban_number", temp_bn)
        setGameSetting("delay", temp_d)
        props.close()
    }

    // @ts-ignore
    return (
        <div class="gs_container">
            <h2 class="popup-title">Game Settings</h2>
            <div>
                <h4>Number of Ban</h4>
                <Select
                    class="custom"
                    initialValue={banNumber()}
                    options={["0", 1, 2, 3, 4]}
                    onChange={e => setBanNumber(e)}
                />
            </div>
            <div>
                <div class="tooltip"><h4>Casual Mode</h4>
                    <span class="tooltiptext">Players can pick the same character whom was previously picked by the other player. Also, in this mode, there is no ban pick timer</span>
                </div>
                <label class="switch">
                    <input type="checkbox" checked={casual()}
                           onChange={e => setCasual(e.currentTarget.checked)}/>
                    <span class="slider round"></span>
                </label>
            </div>
            <div>
                <div class="tooltip"><h4>Delay</h4>
                    <span class="tooltiptext">After banning/picking character, the player will have a small delay to display a popup which indicate if their turn is up</span>
                </div>
                <Select
                    class="custom"
                    initialValue={delay()}
                    options={["0", "3", "5", "8", "10"]}
                    onChange={e => setDelay(e)}
                />
            </div>

            <br/>

            <div>
                <button onClick={() => update_setting()} class="popup_btn">Apply</button>
            </div>


        </div>
    );
}

export {GSForm}