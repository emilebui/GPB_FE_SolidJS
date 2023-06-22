import "./Popup.css"

export default function Popup(props : any) {
    return (
        <>
            <div class="popup2"
                 classList={{
                     ["active"]: props.active
                 }}
            >
                {props.children}
            </div>
        </>
    );
}