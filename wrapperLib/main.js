import { initQueue } from '/src/queueInit.js'
import 'virtual:plugins';
import {EVENTS , CONFIG} from "/src/constant.js";
import {renderWinningBids} from "/src/renderWinningBids.js";
import {run} from "./src/run.js";
import { recordEvent } from "./src/reporting.js";


function getScriptPerformanceEntry(scriptName) {
    const entries = performance.getEntriesByType('resource');
    return entries.find(entry => entry.name.includes(scriptName));
}

const wrapperPerformance = getScriptPerformanceEntry('main.js');
recordEvent(EVENTS.INIT, {
    time: Date.now(),
    timeSincePageLoad: Math.round(performance.now()),
    timeToLoad: Math.round(wrapperPerformance.duration),
})

recordEvent(EVENTS.ERROR, {
    time: Date.now(),
    timeSincePageLoad: Math.round(performance.now()),
    timeToLoad: Math.round(wrapperPerformance.duration),
    message: 'Error loading wrapper',
})



initQueue();
window.googletag = window.googletag || { cmd: [] }

const googleQue = [...googletag.cmd]
googletag.cmd.length = 0

googletag.cmd.push(function () {

    pbjs.onEvent('bidRequested', (data) => {
        const time = Date.now()

        data.bids.forEach(bid => {
            recordEvent(EVENTS.REQUEST, {
                time,
                bidderCode: bid.bidder,
                unitCode: bid.adUnitCode,
            })
        })

    })

    pbjs.onEvent('bidResponse', (data) => {

        recordEvent(EVENTS.RESPONSE, {
            time: Date.now(),
            bidderCode: data.bidderCode,
            unitCode: data.adUnitCode,
            cpm: data.cpm
        })
    })

    pbjs.onEvent('adRenderSucceeded', data => {

        recordEvent(EVENTS.IMPRESSION, {
            time: Date.now(),
            bidderCode: data.bid.bidderCode,
            unitCode: data.bid.adUnitCode,
            cpm: data.bid.cpm
        })
    })

});

googletag.cmd.push(function () {
    googletag.pubads().disableInitialLoad();
});


const placements = {};
googletag.cmd.push(() => {
    const defineSlot_old = googletag.defineSlot;
    googletag.defineSlot = function (adUnitPath, sizes, div) {
        placements[div] = { adUnitPath, sizes, auctionInProgressPromise: run(div, sizes) };

        return defineSlot_old.call(googletag, adUnitPath, sizes, div);
    };
});

if (CONFIG.ad_refresh) {
    googletag.cmd.push(() => {
        googletag.display = function (div) {
            const slots = googletag.pubads().getSlots();
            const div_slot = slots.find(slot => slot.getSlotElementId() === div);
            const slot_sizes = div_slot.getSizes().map(size => {
                return [size.width, size.height];
            });
            setInterval(() => {
                run(div_slot.getSlotElementId(), slot_sizes)
                    .then(() => {
                        renderWinningBids();
                    });
            }, CONFIG.refreshTimeSeconds * 1000);
            placements[div].auctionInProgressPromise.then(() => {
                googletag.pubads().refresh([div_slot]);
            });
        };
    });
} else {
    googletag.cmd.push(() => {
        googletag.display = function (div) {
            const slots = googletag.pubads().getSlots();
            const div_slot = slots.find(slot => slot.getSlotElementId() === div);
            placements[div].auctionInProgressPromise.then(() => {
                googletag.pubads().refresh([div_slot]);
            });
        };
    });
}

googletag.cmd.push(...googleQue);

window.wrapper = window.wrapper || {};
wrapper.cmd = wrapper.cmd || [];
window.wrapper.processQueue();
