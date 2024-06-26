import { Router } from "express";

import bodyParser from 'body-parser';
import { debounce } from "wrapperLib/src/debounce.js";
import { dbInsert, dbQuery, table_config } from '../db/config.js';
import { EVENTS } from '../constants.js';
const analytics = Router()

analytics.get("/", async (req,res) => {
    const {startDate,endDate, type, groupBy} = req.query;
    // graph to show events by type , in 24 hours , grouped by hour
    // new events from client:   bid request, bid response, impression      {Bids:[]{bidderCode,unitCode, cpm}}
    if([EVENTS.INIT, EVENTS.ERROR].includes(type)) {
        return;
    }

    const data = await (await dbQuery(`
        SELECT 
            toStartOfHour(time) AS hour,
            ${groupBy},
            COUNT(*) AS eventCount,
            AVG(cpm) AS averageCpm
        FROM 
            events_anal
        WHERE 
            time BETWEEN '${startDate}' AND '${endDate}' 
            AND eventType == ${type}
        GROUP BY 
            hour,
            ${groupBy}
        ORDER BY 
            hour ASC,
            eventCount DESC;
    `)).json()

    res.json(data)
})

const MAX_CACHE_LEN = 100_000;
const eventsCache = [];

const writeEventsDebounced = debounce(writeEvents, 1000 * 10);
analytics.post("/",bodyParser.json(), (req,res) => {
    const events = req.body;
    //validate
    eventsCache.push(...events);
    if(eventsCache.length > MAX_CACHE_LEN){
        writeEvents();
    }else{
        writeEventsDebounced()
    }

    res.status(204).end('');
})

function writeEvents(){
    console.log('debounce')
    let events = eventsCache.slice();
    eventsCache.length = 0;

    const events_table = 'events_anal'
    const formatEventsData = events
                            .filter(event => ![EVENTS.INIT, EVENTS.ERROR].includes(event.eventType))
                            .map(table_config[events_table].filter)

    formatEventsData.length && dbInsert(events_table, formatEventsData)

    const init_anal = 'init_anal'
    const formatInitData = events
                            .filter(event => [EVENTS.INIT, EVENTS.ERROR].includes(event.eventType))
                            .map(table_config[init_anal].filter)

    formatEventsData.length && dbInsert(init_anal, formatInitData)

}

export default analytics