import {test, assert, vi} from 'vitest'
import { _createIframe } from '../src/createIframe'

test('creates iframe with right properties', () => {
    const document = {
        createElement: nodeName => ({ nodeName })
    }

    const iframe = _createIframe(100, 100, document)

    assert(iframe, {
        nodeName: 'iframe',
        width: '100px',
        height: '100px',
        scrolling: 'no'
    })
})