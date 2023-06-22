import "./Footer.css"
export default function Footer(props : any) {

    const abs = props.Absolute || false

    return (
        <footer
            classList={{
                ["abs"]: abs
            }}
        >
            <div class="footer-content">
                <ul class="info">
                    <li><a
                        href="https://github.com/emilebui/GBP_Deploy"
                        target="_blank"
                    >
                        GitHub
                    </a></li>
                    <li><a
                        href="https://medium.com/@dragonblade9x/making-a-multiplayer-web-game-with-web-socket-that-can-be-scalable-to-millions-of-users-923cc8bd4d3b"
                        target="_blank"
                    >
                        Development Blog
                    </a></li>
                    <li><a
                        href="https://emilebui.github.io/"
                        target="_blank"
                    >
                        Contact
                    </a></li>
                </ul>
            </div>
        </footer>
    )
}