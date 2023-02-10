import { Title } from "solid-start";
import { HttpStatusCode } from "solid-start/server";

export default function NotFoundGame() {
  return (
    <main>
      <Title>Not Found</Title>
      <HttpStatusCode code={404} />
      <h1>Game Not Found</h1>
    </main>
  );
}
