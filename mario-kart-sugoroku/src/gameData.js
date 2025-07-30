// ゲームデータとマス情報
export const SQUARE_TYPES = {
  START: 'start',
  EXERCISE: 'exercise',
  HAPPENING: 'happening',
  RACE: 'race',
  EMPTY: 'empty',
  BRANCH: 'branch'
}

export const EXERCISE_TYPES = {
  BASKETBALL: 'basketball',
  SOCCER: 'soccer',
  HANGING: 'hanging',
  JUMP_ROPE: 'jump_rope'
}

export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  HARD: 'hard'
}

// ゲーム盤のマス定義
export const BOARD_SQUARES = [
  { id: 0, type: SQUARE_TYPES.START, name: 'スタート' },
  { id: 1, type: SQUARE_TYPES.EXERCISE, name: 'バスケットボール', exercise: EXERCISE_TYPES.BASKETBALL, difficulty: DIFFICULTY_LEVELS.EASY, coins: 3 },
  { id: 2, type: SQUARE_TYPES.EMPTY, name: 'イベントなし' },
  { id: 3, type: SQUARE_TYPES.EXERCISE, name: 'サッカー', exercise: EXERCISE_TYPES.SOCCER, difficulty: DIFFICULTY_LEVELS.EASY, coins: 3 },
  { id: 4, type: SQUARE_TYPES.HAPPENING, name: 'ハプニング', event: '1回休み' },
  { id: 5, type: SQUARE_TYPES.EXERCISE, name: '肋木にぶら下がる', exercise: EXERCISE_TYPES.HANGING, difficulty: DIFFICULTY_LEVELS.EASY, coins: 3 },
  { id: 6, type: SQUARE_TYPES.EMPTY, name: 'イベントなし' },
  { id: 7, type: SQUARE_TYPES.EXERCISE, name: '大縄跳び', exercise: EXERCISE_TYPES.JUMP_ROPE, difficulty: DIFFICULTY_LEVELS.EASY, coins: 3 },
  { id: 8, type: SQUARE_TYPES.RACE, name: 'レース', description: '台車マリオカートレース' },
  { id: 9, type: SQUARE_TYPES.EXERCISE, name: 'バスケットボール', exercise: EXERCISE_TYPES.BASKETBALL, difficulty: DIFFICULTY_LEVELS.HARD, coins: 10 },
  { id: 10, type: SQUARE_TYPES.EMPTY, name: 'イベントなし' },
  { id: 11, type: SQUARE_TYPES.EXERCISE, name: 'サッカー', exercise: EXERCISE_TYPES.SOCCER, difficulty: DIFFICULTY_LEVELS.HARD, coins: 10 },
  { id: 12, type: SQUARE_TYPES.HAPPENING, name: 'ハプニング', event: '2マス戻る' },
  { id: 13, type: SQUARE_TYPES.EXERCISE, name: '肋木にぶら下がる', exercise: EXERCISE_TYPES.HANGING, difficulty: DIFFICULTY_LEVELS.HARD, coins: 10 },
  { id: 14, type: SQUARE_TYPES.EMPTY, name: 'イベントなし' },
  { id: 15, type: SQUARE_TYPES.EXERCISE, name: '大縄跳び', exercise: EXERCISE_TYPES.JUMP_ROPE, difficulty: DIFFICULTY_LEVELS.HARD, coins: 10 },
  { id: 16, type: SQUARE_TYPES.RACE, name: 'レース', description: '台車マリオカートレース' },
  { id: 17, type: SQUARE_TYPES.EXERCISE, name: 'バスケットボール', exercise: EXERCISE_TYPES.BASKETBALL, difficulty: DIFFICULTY_LEVELS.EASY, coins: 3 },
  { id: 18, type: SQUARE_TYPES.EXERCISE, name: 'サッカー', exercise: EXERCISE_TYPES.SOCCER, difficulty: DIFFICULTY_LEVELS.EASY, coins: 3 },
  { id: 19, type: SQUARE_TYPES.EXERCISE, name: '肋木にぶら下がる', exercise: EXERCISE_TYPES.HANGING, difficulty: DIFFICULTY_LEVELS.EASY, coins: 3 }
]

// 分岐ルート定義
export const BRANCH_ROUTES = {
  3: [17, 18], // マス3から分岐
  7: [19, 11], // マス7から分岐
  11: [3, 15], // マス11から分岐
  15: [7, 19]  // マス15から分岐
}

// アイテム定義
export const ITEMS = {
  DOUBLE_DICE: { id: 'double_dice', name: 'サイコロ2個', price: 5, description: 'サイコロを2個振れる' },
  TRIPLE_DICE: { id: 'triple_dice', name: 'サイコロ3個', price: 10, description: 'サイコロを3個振れる' }
}

// 運動ミッションの詳細
export const EXERCISE_MISSIONS = {
  [EXERCISE_TYPES.BASKETBALL]: {
    [DIFFICULTY_LEVELS.EASY]: {
      name: 'バスケットボール（簡単）',
      description: 'バスケットゴールに3回シュートを入れる',
      background: 'bg-orange-200'
    },
    [DIFFICULTY_LEVELS.HARD]: {
      name: 'バスケットボール（難しい）',
      description: 'バスケットゴールに5回連続でシュートを入れる',
      background: 'bg-orange-300'
    }
  },
  [EXERCISE_TYPES.SOCCER]: {
    [DIFFICULTY_LEVELS.EASY]: {
      name: 'サッカー（簡単）',
      description: 'ドリブルでコーンを3回まわる',
      background: 'bg-green-200'
    },
    [DIFFICULTY_LEVELS.HARD]: {
      name: 'サッカー（難しい）',
      description: 'ドリブルでコーンを5回まわり、ゴールにシュート',
      background: 'bg-green-300'
    }
  },
  [EXERCISE_TYPES.HANGING]: {
    [DIFFICULTY_LEVELS.EASY]: {
      name: '肋木にぶら下がる（簡単）',
      description: '肋木に10秒間ぶら下がる',
      background: 'bg-brown-200'
    },
    [DIFFICULTY_LEVELS.HARD]: {
      name: '肋木にぶら下がる（難しい）',
      description: '肋木に20秒間ぶら下がる',
      background: 'bg-brown-300'
    }
  },
  [EXERCISE_TYPES.JUMP_ROPE]: {
    [DIFFICULTY_LEVELS.EASY]: {
      name: '大縄跳び（簡単）',
      description: '大縄跳びを10回跳ぶ',
      background: 'bg-purple-200'
    },
    [DIFFICULTY_LEVELS.HARD]: {
      name: '大縄跳び（難しい）',
      description: '大縄跳びを20回連続で跳ぶ',
      background: 'bg-purple-300'
    }
  }
}

// ハプニングイベント
export const HAPPENING_EVENTS = {
  '1回休み': {
    name: '1回休み',
    description: '次のターンをスキップします',
    effect: 'skip_turn'
  },
  '2マス戻る': {
    name: '2マス戻る',
    description: '2マス分後ろに戻ります',
    effect: 'move_back_2'
  }
}

// レースイベント
export const RACE_EVENTS = {
  name: '台車マリオカートレース',
  description: 'あらかじめ設定したコースを台車をカートに見立ててバトルします',
  rewards: {
    first: 10,  // 1位のコイン報酬
    second: 5,  // 2位のコイン報酬
    third: 2    // 3位のコイン報酬
  }
}

