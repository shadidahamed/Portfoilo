const CACHE_NAME = "shadid-portfolio-v2";

const CORE_FILES = [
    "./",
    "./index.html",
    "./styles.css",
    "./app.js",
    "./ai.js",
    "./portfolio-data.js",
    "./manifest.json"
];


self.addEventListener("install", (event) => {

    event.waitUntil(

        caches
            .open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(CORE_FILES);
            })
            .then(() => {
                return self.skipWaiting();
            })

    );

});


self.addEventListener("activate", (event) => {

    event.waitUntil(

        caches
            .keys()
            .then((keys) => {

                return Promise.all(

                    keys
                        .filter(
                            key =>
                                key !== CACHE_NAME
                        )
                        .map(
                            key =>
                                caches.delete(key)
                        )

                );

            })
            .then(() => {

                return self.clients.claim();

            })

    );

});


self.addEventListener("fetch", (event) => {

    if (
        event.request.method !== "GET"
    ) {
        return;
    }

    event.respondWith(

        caches.match(event.request)
            .then((cached) => {

                if (cached) {
                    return cached;
                }

                return fetch(event.request)
                    .then((response) => {

                        if (
                            !response ||
                            response.status !== 200 ||
                            response.type === "opaque"
                        ) {

                            return response;

                        }

                        const cloned =
                            response.clone();

                        caches
                            .open(CACHE_NAME)
                            .then(
                                cache =>
                                    cache.put(
                                        event.request,
                                        cloned
                                    )
                            );

                        return response;

                    })
                    .catch(() => {

                        return caches.match(
                            "./index.html"
                        );

                    });

            })

    );

});
