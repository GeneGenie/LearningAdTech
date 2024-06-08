
import {createIframeProcess} from "./createIframe.js";

function trackEvents(){
    pbjs.onEvent('bidWon', function(data) {
        // debugger
    })
}
trackEvents()

export function renderWinningBids() {
    const winningBids = pbjs.getHighestCpmBids();

    if (!winningBids || winningBids.length === 0) {
        console.warn("No winning bids found.");
        return;
    }
    winningBids.forEach((bid) => {
        const adUnitCode = bid.adUnitCode;

        if (!adUnitCode) {
            console.warn("Bid does not have an adUnitCode.");
            return;
        }

        const adContainer = document.getElementById(adUnitCode);
        if (!adContainer) {
            console.warn(`Ad container with ID ${adUnitCode} not found.`);
            return;
        }

        adContainer.innerHTML = '';
        if (!bid.ad) {
            console.warn(`No ad content found for ad unit code ${adUnitCode}.`);
            return;
        }
        const iframe = createIframeProcess(bid.width,bid.height)
        adContainer.appendChild(iframe)

        pbjs.renderAd(iframe.contentWindow.document, bid.adId);
    });
}
