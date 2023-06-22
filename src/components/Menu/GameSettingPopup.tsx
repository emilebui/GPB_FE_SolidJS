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

    createEffect(
        () => {
            setBanNumber(gameSetting.ban_number)
            setCasual(gameSetting.casual)
        }
    )

    const update_setting = () => {
        setGameSetting("casual", casual())
        setGameSetting("ban_number", banNumber())
        props.close()
    }

    const update_ban = (value: any) => {
        if (value === "No Ban") {
            setBanNumber(0)
        } else {
            setBanNumber(value)
        }
    }

    const get_ban_select = (bn: number) => {
        if (bn === 0) {
            return "No Ban"
        } else {
            return bn
        }
    }

    // @ts-ignore
    return (
        <div class="gs_container">
            <h2 class="popup-title">Game Settings</h2>
            <div>
                <h4>Number of Ban</h4>
                <Select
                    class="custom"
                    initialValue={get_ban_select(banNumber())}
                    options={["No Ban", 1, 2, 3, 4]}
                    onChange={e => setBanNumber(e)}
                />
            </div>
            <div>
                <div class="tooltip"><h4>Casual Mode</h4>
                    <span class="tooltiptext">Players can choose the same characters rather than not being able to pick characters that were already picked by other player</span>
                </div>
                <label class="switch">
                    <input type="checkbox" checked={casual()}
                           onChange={e => setCasual(e.currentTarget.checked)}/>
                    <span class="slider round"></span>
                </label>
            </div>
            <br/>

            <div>
                <button onClick={() => update_setting()} class="popup_btn">Apply</button>
            </div>


        </div>
    );
}

export {GSForm}