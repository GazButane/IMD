function findGLBLinks() {
    const text = document.documentElement.innerHTML;
    const regex = /https?:\/\/[^\s"']+\.glb/g;
    const matches = text.match(regex) || [];
    return [...new Set(matches)];
}

const glbLinks = findGLBLinks();

console.log("[IKEA EXT] GLB found on the page:", glbLinks);

browser.runtime.sendMessage({
    type: "GLB_LINKS",
    links: glbLinks
});
