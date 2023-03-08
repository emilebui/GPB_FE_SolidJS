import {useParams} from "@solidjs/router";
import Menu from "~/components/Menu/Menu";
import Footer from "~/components/Footer/Footer";
export default function Join() {

    const params = useParams();
    const gid = params.gameid

    return (
        <main>
            <Menu player="Player2" gid={gid}>
                <h1>Enter your nickname and join the game !!!</h1>
            </Menu>
            <Footer Absolute={true}></Footer>
        </main>
    );
}