import {useParams} from "@solidjs/router";
import Menu from "~/components/Menu/Menu";
import Footer from "~/components/Footer/Footer";
export default function Spectate() {

    const params = useParams();
    const gid = params.gameid

    return (
        <main>
            <Menu player="Anonymous" gid={gid} watch={true}>
                <h1>Enter your nickname and watch the game !!!</h1>
            </Menu>
            <Footer Absolute={true}></Footer>
        </main>
    );
}