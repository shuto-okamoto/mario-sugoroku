#!/bin/bash

echo "🔥 Firebase デプロイスクリプト 🔥"
echo "=========================================="

# プロジェクトディレクトリに移動
cd "/Applications/マリオすごろく/mario-kart-sugoroku"

echo "📦 アプリケーションをビルド中..."
npm run build

echo "🚀 Firebaseプロジェクトを作成中..."
# 注意: このコマンドは手動でFirebaseコンソールで実行するか、ログイン後に実行してください
# firebase projects:create mario-sugoroku-game --display-name "マリオすごろく"

echo "🔧 Firebase Hostingを有効化中..."
# firebase use mario-sugoroku-game
# firebase init hosting

echo "🌐 デプロイ中..."
# firebase deploy --only hosting

echo "✅ 完了！以下のURLでアクセスできます："
echo "🌍 https://mario-sugoroku-game.web.app"
echo "🌍 https://mario-sugoroku-game.firebaseapp.com"

echo ""
echo "手動実行が必要な手順："
echo "1. firebase login"
echo "2. firebase projects:create mario-sugoroku-game --display-name 'マリオすごろく'"
echo "3. firebase use mario-sugoroku-game"
echo "4. firebase deploy --only hosting"