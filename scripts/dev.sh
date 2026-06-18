#!/bin/bash
set -e

echo "🚀 Starting Brainify development environment..."

# Copy .env.example to .env if not exists
if [ ! -f .env ]; then
  echo "📝 Creating .env from .env.example..."
  cp .env.example .env
fi

echo "📦 Installing dependencies..."
npm install

echo "🏗️  Building shared package..."
npm run build -w packages/shared

echo "🖥️  Starting dev servers (backend:8080 + frontend:3000)..."
npm run dev