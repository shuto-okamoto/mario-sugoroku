# 🏎️ マリオすごろく - 運動自立活動ゲーム

小学校1年生から6年生を対象とした、マリオカート風の双六ゲームです。バスケットボール、サッカー、大縄跳びなどの運動ミッションを含む教育的なWebアプリケーションです。

## 🎮 ゲームの特徴

- **マリオカート風の円形レーストラック**
- **3チーム対戦 (最大30名)**
- **運動ミッション**: バスケットボール、サッカー、肋木にぶら下がる、大縄跳び
- **45分タイマー機能**
- **美しいランキング表示**
- **モバイル対応**

## 🚀 技術スタック

- **React 19** - フロントエンド
- **Vite** - ビルドツール
- **Tailwind CSS** - スタイリング
- **Radix UI** - コンポーネントライブラリ
- **Lucide React** - アイコン
- **Framer Motion** - アニメーション

## 📱 デプロイ

### Firebase Hosting
```bash
npm run build
firebase login
firebase projects:create mario-sugoroku-game
firebase use mario-sugoroku-game
firebase deploy --only hosting
```

### ローカル開発
```bash
cd mario-kart-sugoroku
npm install
npm run dev
```

## 🎯 ゲームルール

1. 3チームでスタート
2. サイコロを振ってマスを進む
3. 止まったマスに応じてイベント発生
4. 45分の制限時間内でスター獲得を競う
5. スター数 → コイン数 → アイテム数で順位決定

## 📊 マスの種類

- 🟡 **スタートマス**: ゲーム開始地点
- 🟢 **運動ミッション（簡単）**: 3コイン獲得
- 🔴 **運動ミッション（難しい）**: 10コイン獲得
- 🟣 **ハプニングマス**: 1回休み、2マス戻る
- 🟠 **レースマス**: 台車マリオカートバトル
- ⚪ **イベントなしマス**: 何も起こらない

## 🏆 改良点

### 視覚的改善
- マリオカート風円形トラック
- カートアイコンでプレイヤー表示
- 色分けされたマス表示
- アニメーション付きスター

### 機能強化
- 45分タイマー（一時停止/リセット可能）
- プログレスバー表示
- 自動ゲーム終了
- 美しいランキング画面

### UX向上
- レスポンシブデザイン
- 魅力的なアニメーション
- 絵文字を使った親しみやすいUI
- ホバーエフェクト

---

🎉 **楽しい運動自立活動をお楽しみください！** 🎉# GitHub Pages強制更新
