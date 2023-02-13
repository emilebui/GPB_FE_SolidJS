import { Title } from "solid-start";
import Menu from "~/components/Menu/Menu";
// @ts-ignore
import { v4 } from "uuid";

export default function Home() {

  const new_gid = v4()

  return (
    <main>
      <Title>Create Genshin Ban Pick Game</Title>
      <Menu player="Player1" gid={new_gid}>
          <h1 style="font-family:HYWenHei;">Welcome to Genshin Ban Pick</h1>
      </Menu>
    </main>
  );
}
