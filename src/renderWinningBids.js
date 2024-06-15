// export function renderWinningBids() {
//     const winningBids = pbjs.getHighestCpmBids();
//
//     if (!winningBids || winningBids.length === 0) {
//         console.warn("No winning bids found.");
//         return;
//     }
//
//     winningBids.forEach(function(bid) {
//         const adUnitCode = bid.adUnitCode;
//
//         if (!adUnitCode) {
//             console.warn("Bid does not have an adUnitCode.");
//             return;
//         }
//
//         const adContainer = document.getElementById(adUnitCode);
//         if (!adContainer) {
//             console.warn(`Ad container with ID ${adUnitCode} not found.`);
//             return;
//         }
//
//
//         console.log(`Rendering ad for ad unit code: ${adUnitCode}`);
//
//         pbjs.renderAd(document, adUnitCode);
//     });
// }

import { createHook } from "./processes.js";

console.log("Hello World");
export const createIframeProcess = createHook("sync", _createIframe);

function _createIframe(width, height) {
  const iframe = document.createElement("iframe");
  iframe.width = width + "px";
  iframe.height = height + "px";
  iframe.style.overflow = "hidden";
  iframe.style.border = "0";
  iframe.scrolling = "no";

  iframe.srcdoc = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <title>Ad</title>
            </head>
            <body></body>
            </html>
        `;
  return iframe;
}
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

    adContainer.innerHTML = "";
    if (!bid.ad) {
      console.warn(`No ad content found for ad unit code ${adUnitCode}.`);
      return;
    }
    const iframe = createIframeProcess(bid.width, bid.height);
    // import.meta.env.VITE_ADD_RED_FRAME==='1' && addRedFrameToElement(iframe)
    adContainer.appendChild(iframe);

    pbjs.renderAd(iframe.contentWindow.document, bid.adId);
  });
}
