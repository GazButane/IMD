
let lastFoundLinks = [];

function bgLog(...args) {
    console.log("[IKEA EXT BACKGROUND]", ...args);
}

function getCleanName(link) {
    return link.split("-").pop().split("?")[0];
}



browser.runtime.onMessage.addListener((message, sender) => {
    bgLog("Message received:", message);

    if (!message || !message.type) {
        bgLog("Message invalide (pas de type).");
        return;
    }

    switch (message.type) {

        case "GLB_LINKS":
            if (Array.isArray(message.links)) {
                lastFoundLinks = message.links.slice();
                bgLog("Link storage (count):", lastFoundLinks.length);
            } else {
                bgLog("GLB_LINKS received but 'links' is not an array:", message.links);
            }
            break;

        case "GET_LINKS":
            bgLog("GET_LINKS requested by", sender && sender.tab ? `tab ${sender.tab.id}` : "popup/background");
            return Promise.resolve({ links: lastFoundLinks });

        case "DOWNLOAD_ONE":
            if (typeof message.link === "string") {
                const filename = getCleanName(message.link);
                bgLog("Download :", message.link, "=>", filename);

                browser.downloads.download({
                    url: message.link,
                    filename,
                    saveAs: false
                })
                .then(id => bgLog("Download OK. ID =", id))
                .catch(err => bgLog("ERROR DOWNLOAD_ONE :", err));
            }
            break;

        case "DOWNLOAD_ALL":
            lastFoundLinks.forEach((link, i) => {
                const filename = getCleanName(link);
                bgLog("Download :", link, "=>", filename);

                browser.downloads.download({
                    url: link,
                    filename,
                    saveAs: false
                })
                .then(id => bgLog("Download OK. ID =", id))
                .catch(err => bgLog("ERROR DOWNLOAD_ALL pour", link, err));
            });
            break;


        default:
            bgLog("Unhandled message type :", message.type);
            break;
    }
});
