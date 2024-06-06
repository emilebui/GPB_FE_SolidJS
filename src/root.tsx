// @refresh reload
import {Suspense} from "solid-js";
import {
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

export default function Root() {
    return (
        <Html lang="en">
            <Head>
                <Title>Genshin Ban Pick</Title>
                <Meta charset="utf-8"/>
                <Meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="shortcut icon" type="image/ico" href="/favicon.ico" />
                <script async
                        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3990919966665724"
                        crossOrigin="anonymous"></script>
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
                <Scripts/>
            </Body>
        </Html>
    );
}
