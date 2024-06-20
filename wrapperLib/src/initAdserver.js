export function initAdserver(googletag, pbjs) {
    googletag.cmd.push(() => {
        pbjs.setTargetingForGPTAsync();
    });
}