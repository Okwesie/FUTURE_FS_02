#!/bin/bash

echo "🚀 E-commerce Storefront Deployment Helper"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "✅ Project structure verified"

# Test production build
echo "🔨 Testing production build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Production build successful"
else
    echo "❌ Production build failed"
    exit 1
fi

# Check backend
echo "🔍 Checking backend..."
cd backend
if [ -f "package.json" ] && [ -f "src/server.js" ]; then
    echo "✅ Backend structure verified"
else
    echo "❌ Backend structure incomplete"
    exit 1
fi

cd ..

echo ""
echo "🎯 Ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Push your code to GitHub"
echo "2. Deploy backend to Railway or Render"
echo "3. Deploy frontend to Vercel"
echo "4. Update CORS settings"
echo "5. Test your live application"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
echo "📋 See DEPLOYMENT_CHECKLIST.md for step-by-step guide"
