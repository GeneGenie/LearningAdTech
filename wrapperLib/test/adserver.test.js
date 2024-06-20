import {test, expect, vi} from 'vitest'
import { initAdserver } from '../src/initAdserver'

test('init server sets targetings', () => {
    const pbjs = {
        setTargetingForGPTAsync: () => {}
    }
    const googletag = { cmd: { push: fn => fn() } }

    const setTargeingsSpy = vi.spyOn(pbjs, 'setTargetingForGPTAsync')

    initAdserver(googletag, pbjs)

    expect(setTargeingsSpy).toBeCalled()
})