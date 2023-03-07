import "./popup.css"

export default function AnnoucePopup(props : any) {
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