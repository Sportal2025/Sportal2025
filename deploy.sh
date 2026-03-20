#!/bin/bash

echo "🚀 Starting Deployment..."

# 1. Add all changes
echo "📦 Adding files..."
git add .

# 2. Commit changes
echo "💾 Committing changes..."
# You can customize the message here if you want
git commit -m "Update from terminal script: $(date)"

# 3. Push to GitHub
echo "⬆️ Pushing to GitHub..."
git push origin main

echo "✅ Done! Monitor your deployment at app.netlify.com"
