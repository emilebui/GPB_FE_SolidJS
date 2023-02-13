import "../Menu/Menu.css"
export function LoadingMenu(props : any) {
    return (
        <div class="container">
            { props.children }
        </div>
    );
}