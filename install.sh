#!/bin/bash
# StarterForge CLI Installation Script

set -e

echo "🚀 Installing StarterForge CLI..."
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first:"
    echo "   https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2)
MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1)

if [ "$MAJOR_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16+ is required. You have version $NODE_VERSION"
    echo "   Please upgrade Node.js: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $NODE_VERSION detected"
echo

# Install StarterForge
echo "📦 Installing StarterForge globally..."
if npm install -g starterforge; then
    echo "✅ StarterForge CLI installed successfully!"
    echo
    echo "🎉 You can now use StarterForge:"
    echo "   starterforge --help"
    echo "   starterforge my-config.json"
    echo "   starterforge web  # Launch web wizard"
    echo
    echo "📚 Documentation: https://github.com/starterforge/starterforge"
    echo "🌐 Web wizard will be available at http://localhost:3001"
else
    echo "❌ Installation failed. You might need to run with sudo:"
    echo "   sudo $0"
    exit 1
fi