// Debug script pour tester les fonctions utils
const { formatPrice, formatKilometrage } = require('./src/lib/utils.ts')

console.log('formatPrice(1000000):', JSON.stringify(formatPrice(1000000)))
console.log('formatKilometrage(15000):', JSON.stringify(formatKilometrage(15000)))
console.log('formatKilometrage(15000) length:', formatKilometrage(15000).length)

// Test character by character
const km = formatKilometrage(15000)
for (let i = 0; i < km.length; i++) {
  console.log(`char ${i}: "${km[i]}" (${km.charCodeAt(i)})`)
}
