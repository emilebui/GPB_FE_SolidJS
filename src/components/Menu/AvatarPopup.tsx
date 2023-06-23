import './AvatarPopup.css';
import {Avatar} from "~/types/types";
import {For} from "solid-js";
import {Avatars} from "~/data/avatars";
import {setAvatar} from "~/data/store";

export function AvatarImage(a : Avatar) {
    return (
        <img class="avatar_img"
             src={a.path}
             alt=""
        />
    )
}

function AvatarDisplay(trigger : any, a : Avatar) {
    return (
      <button onClick={() => trigger(a.id)}>
          {AvatarImage(a)}
      </button>
    );
}

export default function AvatarPopup(props : any) {
    const setAva = (i : number) => {
        setAvatar(i)
        props.setTrigger(false)
    }

    return (
        <>
            {/*{   props.trigger &&*/}
                <div class="popup"
                    classList={{
                        ["active"]: props.trigger
                    }}
                >
                    <div class="popup-inner">
                        {props.children}
                        <div class="ava_grid ava_grid_team">
                            <For each={Avatars}>{a => AvatarDisplay(setAva, a)}</For>
                        </div>
                    </div>
                </div>
            {/*}*/}
        </>
    );

}