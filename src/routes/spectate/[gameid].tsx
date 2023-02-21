import {useParams} from "@solidjs/router";
import Menu from "~/components/Menu/Menu";
export default function Spectate() {

    const params = useParams();
    const gid = params.gameid

    return (
          <Menu player="Player2" gid={gid} watch={true}>
              <h1>Enter your nickname and watch the game !!!</h1>
          </Menu>
    );
}