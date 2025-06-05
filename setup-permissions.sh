#!/bin/bash
mkdir -p scripts
chmod +x scripts/*.sh 2>/dev/null || true
find scripts -name "*.sh" -exec chmod +x {} \; 2>/dev/null || true
echo "✅ Permissions fixed!"
