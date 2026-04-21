#!/bin/bash
set -e

echo "=== Purging dev cache before production build ==="
rm -rf .next/dev .next/cache .turbo node_modules/.cache

echo "=== Building Next.js production bundle ==="
next build

echo "=== Copying static assets to standalone ==="
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/

echo "=== Cleaning up to reduce image size ==="
rm -rf node_modules
rm -rf Minasa-Gold-Khenchela-main
rm -rf attached_assets
rm -rf .next/cache
rm -rf .next/dev
rm -rf .turbo

echo "=== Build complete ==="
du -sh .next/standalone/
