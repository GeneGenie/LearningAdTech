import "dotenv/config"
import {createClient} from "@clickhouse/client"
import moment from 'moment'

export const table_config = {
    'events_anal': {
        filter: (event) => {
            const { eventType, eventData: { time, bidderCode, unitCode, cpm } } = event
            const timeString = moment(time).format('YYYY-MM-DD hh:mm:ss')
            return { time: timeString, eventType, bidderCode, unitCode, cpm }
        }
    },
    'init_anal': {
        filter: (event) => {
            const { eventType, eventData: { time, timeSincePageLoad, timeToLoad, message } } = event
            const timeString = moment(time).format('YYYY-MM-DD hh:mm:ss')
            return { time: time, eventType, timeSincePageLoad, timeToLoad, message }
        }
    }
}

const client = createClient({
    url: process.env.CLICKHOUSE_HOST ?? 'http://localhost:8123',
    username: process.env.CLICKHOUSE_USER ?? 'default',
    password: process.env.CLICKHOUSE_PASSWORD ?? '',
})

// client.query(`
// CREATE TABLE IF NOT EXISTS events_anal
// (
//     time DateTime,
//     bidderCode String,
//     unitCode String,
//     cpm Int16,
//     eventType Int8
// )
// `)

// client.query(`
// CREATE TABLE IF NOT EXISTS init_anal
// (
//     time DateTime,
//     timeSincePageLoad Int32,
//     timeToLoad Int32,
//     eventType Int8,
//     message Nullable(String)
// )
// `)

export const dbQuery = async (query) => {
    return client.query({
        query,
        format: 'JSONEachRow',
    })
}

export const dbInsert = (table, data) => {
    return client.insert({
        table,
        values: data,
        format: 'JSONEachRow',
    })
}


