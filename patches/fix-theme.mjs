import { readFileSync, writeFileSync, existsSync, globSync } from 'fs'

console.log('[fix-theme] Patching valaxy-theme-yun for route undefined errors...')

// Find all Vue files in the theme
const pattern = 'node_modules/.pnpm/valaxy-theme-yun*/node_modules/valaxy-theme-yun/**/*.vue'
const files = globSync(pattern)

if (files.length === 0) {
  console.log('[fix-theme] No theme files found, skipping patch')
  process.exit(0)
}

let patchedCount = 0

for (const filePath of files) {
  if (!existsSync(filePath)) continue

  let content = readFileSync(filePath, 'utf-8')
  const originalContent = content

  // Fix 1: route.meta -> route?.meta
  content = content.replace(/route\.meta(?!\?)/g, 'route?.meta')

  // Fix 2: route.path -> route?.path
  content = content.replace(/route\.path(?!\?)/g, 'route?.path')

  // Fix 3: route.query -> route?.query
  content = content.replace(/route\.query(?!\?)/g, 'route?.query')

  // Fix 4: route.params -> route?.params
  content = content.replace(/route\.params(?!\?)/g, 'route?.params')

  // Fix 5: route.fullPath -> route?.fullPath
  content = content.replace(/route\.fullPath(?!\?)/g, 'route?.fullPath')

  // Fix 6: route.name -> route?.name
  content = content.replace(/route\.name(?!\?)/g, 'route?.name')

  if (content !== originalContent) {
    writeFileSync(filePath, content, 'utf-8')
    patchedCount++
    console.log(`[fix-theme] Patched: ${filePath.split('/').pop()}`)
  }
}

console.log(`[fix-theme] Done! Patched ${patchedCount} files.`)
