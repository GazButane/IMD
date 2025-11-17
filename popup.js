document.addEventListener("DOMContentLoaded", () => {

    const logDiv = document.getElementById("logs");
    logDiv.className = "logdiv"
    const fileListDiv = document.getElementById("fileList");

    function log(text) {
        logDiv.textContent += text + "\n";
    }

    function displayFiles(files) {
        fileListDiv.innerHTML = "";

        if (files.length === 0) {
            fileListDiv.textContent = "No .glb files found :(";
            return;
        }

        files.forEach(link => {
            const btn = document.createElement("button");
            btn.textContent = "💾 " + link;
            btn.className = "file-button";
            btn.addEventListener("click", () => {
                log("→ DOWNLOAD_ONE sended for : " + link);
                browser.runtime.sendMessage({
                    type: "DOWNLOAD_ONE",
                    link: link
                });
            });
            fileListDiv.appendChild(btn);
        });
    }

    function refreshLinks() {
        browser.runtime.sendMessage({ type: "GET_LINKS" }).then(res => {
            log("Links : " + res.links.length);
            displayFiles(res.links);
        });
    }

    document.getElementById("refresh").addEventListener("click", refreshLinks);

    document.getElementById("download").addEventListener("click", () => {
        log("→ DOWNLOAD_ALL sended");
        browser.runtime.sendMessage({ type: "DOWNLOAD_ALL" });
    });

    refreshLinks();
});
