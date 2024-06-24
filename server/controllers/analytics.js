import {debounce} from "wrapperLib/src/debounce.js";
import bodyParser from "body-parser";

const MAX_CACHE_LEN = 100_000;
const eventsCache = [];
function writeEvents(){

    const events = eventsCache.slice();
    eventsCache.length = 0;
}

const writeEventsDebounced = debounce(writeEvents, 1000 * 60);

app.post('/analytics',bodyParser.json(), (req, res) => {
    const events = req.body;
    //validate

    eventsCache.push(events);
    if(eventsCache.length > MAX_CACHE_LEN){
        writeEvents();
    }else{
        writeEventsDebounced()
    }

    res.status(204).end('');
})


app.get('/analytics', (req, res) => {
    const {startDate,endDate, type, groupBy} = req.query;
    // graph to show events by type , in 24 hours , grouped by hour
    // new events from client:   bid request, bid response, impression      {Bids:[]{bidderCode,unitCode, cpm}}
    res.json(eventsCache)
})