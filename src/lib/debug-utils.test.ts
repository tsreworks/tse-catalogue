import { formatPrice, formatKilometrage } from './utils'

describe('Debug Utils', () => {
  it('should debug formatPrice', () => {
    const result = formatPrice(1000000)
    console.log('formatPrice result:', JSON.stringify(result))
    console.log('formatPrice result length:', result.length)
    for (let i = 0; i < result.length; i++) {
      console.log(`char ${i}: "${result[i]}" (${result.charCodeAt(i)})`)
    }
  })

  it('should debug formatKilometrage', () => {
    const result = formatKilometrage(15000)
    console.log('formatKilometrage result:', JSON.stringify(result))
    console.log('formatKilometrage result length:', result.length)
    for (let i = 0; i < result.length; i++) {
      console.log(`char ${i}: "${result[i]}" (${result.charCodeAt(i)})`)
    }
  })
})
