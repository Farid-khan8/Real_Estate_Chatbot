#!/bin/bash
# Cleanup script for macOS

echo "🧹 Cleaning up..."

# Kill processes
lsof -ti:8000 | xargs kill -9 2>/dev/null && echo "Stopped Django server"
lsof -ti:3000 | xargs kill -9 2>/dev/null && echo "Stopped React server"

# Optional: Delete databases and caches
read -p "Delete database and start fresh? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    rm -f backend/db.sqlite3
    echo "Deleted database"
fi

read -p "Clear npm cache and node_modules? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    rm -rf frontend/node_modules frontend/package-lock.json
    npm cache clean --force
    echo "Cleared frontend cache"
fi

echo "✅ Cleanup complete!"