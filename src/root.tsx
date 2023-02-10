// @refresh reload
import {Suspense} from "solid-js";
import {
    A,
    Body,
    ErrorBoundary,
    FileRoutes,
    Head,
    Html,
    Meta,
    Routes,
    Scripts,
    Title,
} from "solid-start";
import "./root.css";
import styles from "~/components/App/App.module.css";

export default function Root() {
    return (
        <Html lang="en">
            <Head>
                <Title>Genshin Ban Pick</Title>
                <Meta charset="utf-8"/>
                <Meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="shortcut icon" type="image/ico" href="/src/assets/favicon.ico" />
            </Head>
            <Body>
                <noscript>You need to enable JavaScript to run this app.</noscript>
                <Suspense>
                    <ErrorBoundary>
                        <Routes>
                            <FileRoutes/>
                        </Routes>
                    </ErrorBoundary>
                </Suspense>
                <footer>
                    <div class="footer-content">
                        <ul class="info">
                            <li><a
                                href="https://github.com/Pustur/genshin-impact-team-randomizer"
                                target="_blank"
                            >
                                GitHub
                            </a></li>
                            <li><a
                                href="#"
                                target="_blank"
                            >
                                Development Blog
                            </a></li>
                        </ul>
                    </div>
                </footer>
                <Scripts/>
            </Body>
        </Html>
    );
}
