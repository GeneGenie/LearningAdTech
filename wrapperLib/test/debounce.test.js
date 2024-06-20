import {test, expect, vi, beforeEach} from 'vitest'
import { debounce } from '../src/debounce'

test('debounce', async () => {
    const func = vi.fn(() => {})
    const debouncedFunc = debounce(func, 1000)

    vi.useFakeTimers()

    for(let i = 0; i < 20; i++) {
        debouncedFunc()
    }

    vi.runAllTimers()
    
    expect(func).toHaveBeenCalledTimes(1)
})