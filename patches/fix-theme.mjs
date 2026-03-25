import { readFileSync, writeFileSync, existsSync, globSync } from 'fs'
import { join } from 'path'

// Find the theme's App.vue file
const pattern = 'node_modules/.pnpm/valaxy-theme-yun*/node_modules/valaxy-theme-yun/App.vue'
const files = globSync(pattern)

if (files.length === 0) {
  console.log('[fix-theme] No App.vue found, skipping patch')
  process.exit(0)
}

const appVuePath = files[0]
console.log(`[fix-theme] Found App.vue at: ${appVuePath}`)

if (!existsSync(appVuePath)) {
  console.log('[fix-theme] App.vue does not exist, skipping patch')
  process.exit(0)
}

let content = readFileSync(appVuePath, 'utf-8')

// Check if already patched
if (content.includes('route?.meta?.layout')) {
  console.log('[fix-theme] Already patched, skipping')
  process.exit(0)
}

// Fix the route.meta undefined error
// Replace route.meta.layout with route?.meta?.layout
const originalContent = content
content = content.replace(
  /route\.meta\.layout/g,
  'route?.meta?.layout'
)

if (content === originalContent) {
  console.log('[fix-theme] No changes needed')
  process.exit(0)
}

writeFileSync(appVuePath, content, 'utf-8')
console.log('[fix-theme] Successfully patched App.vue')
console.log('[fix-theme] - route.meta.layout -> route?.meta?.layout')
