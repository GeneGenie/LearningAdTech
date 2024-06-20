import {test, expect} from 'vitest'
import { adUnitsF } from '../src/adUnits'

test('returns right adunits', () => {
    const code = 'test-code-1'
    const sizes = [300, 250]
    const adUnits = adUnitsF(code, sizes)
    expect(adUnits.code).eq(code)
    expect(adUnits.mediaTypes.banner.sizes).eq(sizes)
})