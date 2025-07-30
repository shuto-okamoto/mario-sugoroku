import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Star, Coins, ShoppingCart } from 'lucide-react'
import EventModal from './components/EventModal.jsx'
import BranchModal from './components/BranchModal.jsx'
import { 
  BOARD_SQUARES, 
  BRANCH_ROUTES, 
  ITEMS, 
  SQUARE_TYPES,
  HAPPENING_EVENTS
} from './gameData.js'
import gameBoardImage from './assets/game_board_concept.png'
import './App.css'

// ゲームの状態
const GAME_STATES = {
  SETUP: 'setup',
  PLAYING: 'playing',
  FINISHED: 'finished'
}

// チームの色
const TEAM_COLORS = {
  RED: '#ef4444',
  BLUE: '#3b82f6',
  YELLOW: '#eab308'
}

function App() {
  const [gameState, setGameState] = useState(GAME_STATES.SETUP)
  const [teams, setTeams] = useState([
    { id: 1, name: '', color: TEAM_COLORS.RED, position: 0, stars: 0, coins: 0, items: [], skipTurn: false },
    { id: 2, name: '', color: TEAM_COLORS.BLUE, position: 0, stars: 0, coins: 0, items: [], skipTurn: false },
    { id: 3, name: '', color: TEAM_COLORS.YELLOW, position: 0, stars: 0, coins: 0, items: [], skipTurn: false }
  ])
  const [currentTeam, setCurrentTeam] = useState(0)
  const [diceResult, setDiceResult] = useState(null)
  const [diceCount, setDiceCount] = useState(1)
  const [showDice, setShowDice] = useState(false)
  const [starPosition, setStarPosition] = useState(5)
  const [eventModal, setEventModal] = useState({ isOpen: false, square: null })
  const [branchModal, setBranchModal] = useState({ isOpen: false, options: null, position: null })
  const [canRollAgain, setCanRollAgain] = useState(false)
  const [gameTimer, setGameTimer] = useState(45 * 60) // 45分を秒で表現
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  // チーム名の更新
  const updateTeamName = (teamId, name) => {
    setTeams(teams.map(team => 
      team.id === teamId ? { ...team, name } : team
    ))
  }

  // ゲーム開始
  const startGame = () => {
    const hasAllNames = teams.every(team => team.name.trim() !== '')
    if (hasAllNames) {
      setGameState(GAME_STATES.PLAYING)
      setIsTimerRunning(true)
      // 初期スター位置をランダムに設定
      setStarPosition(Math.floor(Math.random() * BOARD_SQUARES.length))
    } else {
      alert('すべてのチーム名を入力してください')
    }
  }

  // スターの再配置
  const relocateStar = (currentStarPos) => {
    let newPosition
    do {
      newPosition = Math.floor(Math.random() * BOARD_SQUARES.length)
    } while (Math.abs(newPosition - currentStarPos) < 5) // 現在位置から離れた場所に配置
    
    setStarPosition(newPosition)
  }

  // サイコロを振る
  const rollDice = () => {
    // 現在のチームがスキップターンの場合
    if (teams[currentTeam].skipTurn) {
      const newTeams = [...teams]
      newTeams[currentTeam].skipTurn = false
      setTeams(newTeams)
      setCurrentTeam((currentTeam + 1) % 3)
      return
    }

    setShowDice(true)
    const results = []
    for (let i = 0; i < diceCount; i++) {
      results.push(Math.floor(Math.random() * 6) + 1)
    }
    const totalResult = results.reduce((sum, val) => sum + val, 0)
    setDiceResult(totalResult)
    
    // アニメーション後にサイコロを隠す
    setTimeout(() => {
      setShowDice(false)
      movePlayer(totalResult)
    }, 2000)
  }

  // プレイヤーを移動
  const movePlayer = (steps) => {
    const newTeams = [...teams]
    const currentPos = newTeams[currentTeam].position
    let newPos = (currentPos + steps) % BOARD_SQUARES.length
    
    newTeams[currentTeam].position = newPos
    setTeams(newTeams)

    // スターの位置チェック
    if (newPos === starPosition) {
      newTeams[currentTeam].stars += 1
      setTeams(newTeams)
      relocateStar(starPosition)
    }

    // 分岐チェック
    if (BRANCH_ROUTES[newPos]) {
      setBranchModal({
        isOpen: true,
        options: BRANCH_ROUTES[newPos],
        position: newPos
      })
      return
    }

    // イベントチェック
    const square = BOARD_SQUARES[newPos]
    if (square && square.type !== SQUARE_TYPES.START && square.type !== SQUARE_TYPES.EMPTY) {
      setEventModal({ isOpen: true, square })
    } else {
      // 次のプレイヤーに交代（もう一度振れる場合を除く）
      if (!canRollAgain) {
        nextTurn()
      }
    }
  }

  // 次のターンに進む
  const nextTurn = () => {
    setCanRollAgain(false)
    setDiceCount(1)
    setCurrentTeam((currentTeam + 1) % 3)
  }

  // 分岐選択
  const handleBranchSelect = (targetPosition) => {
    const newTeams = [...teams]
    newTeams[currentTeam].position = targetPosition
    setTeams(newTeams)

    // スターの位置チェック
    if (targetPosition === starPosition) {
      newTeams[currentTeam].stars += 1
      setTeams(newTeams)
      relocateStar(starPosition)
    }

    // イベントチェック
    const square = BOARD_SQUARES[targetPosition]
    if (square && square.type !== SQUARE_TYPES.START && square.type !== SQUARE_TYPES.EMPTY) {
      setEventModal({ isOpen: true, square })
    } else {
      nextTurn()
    }
  }

  // ミッション成功
  const handleMissionComplete = (coins) => {
    const newTeams = [...teams]
    newTeams[currentTeam].coins += coins
    setTeams(newTeams)
    setCanRollAgain(true)
  }

  // ミッション失敗
  const handleMissionFail = () => {
    // 何もしない（次のターンに進む）
  }

  // レース結果
  const handleRaceResult = (coins) => {
    const newTeams = [...teams]
    newTeams[currentTeam].coins += coins
    setTeams(newTeams)
  }

  // ハプニング処理
  const handleHappeningComplete = (eventType) => {
    const newTeams = [...teams]
    const happening = HAPPENING_EVENTS[eventType]
    
    if (happening.effect === 'skip_turn') {
      newTeams[currentTeam].skipTurn = true
    } else if (happening.effect === 'move_back_2') {
      const currentPos = newTeams[currentTeam].position
      const newPos = Math.max(0, currentPos - 2)
      newTeams[currentTeam].position = newPos
    }
    
    setTeams(newTeams)
  }

  // アイテム購入
  const buyItem = (itemId) => {
    const item = ITEMS[itemId]
    const newTeams = [...teams]
    const team = newTeams[currentTeam]
    
    if (team.coins >= item.price) {
      team.coins -= item.price
      team.items.push(item)
      setTeams(newTeams)
    } else {
      alert('コインが足りません')
    }
  }

  // アイテム使用
  const useItem = (itemId) => {
    const newTeams = [...teams]
    const team = newTeams[currentTeam]
    const itemIndex = team.items.findIndex(item => item.id === itemId)
    
    if (itemIndex !== -1) {
      team.items.splice(itemIndex, 1)
      if (itemId === 'double_dice') {
        setDiceCount(2)
      } else if (itemId === 'triple_dice') {
        setDiceCount(3)
      }
      setTeams(newTeams)
    }
  }

  // タイムーを時間形式に変換
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // タイムー機能
  useEffect(() => {
    let interval = null
    if (isTimerRunning && gameTimer > 0) {
      interval = setInterval(() => {
        setGameTimer(timer => {
          if (timer <= 1) {
            setIsTimerRunning(false)
            setGameState(GAME_STATES.FINISHED)
            return 0
          }
          return timer - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, gameTimer])

  // サイコロのアイコンを取得
  const getDiceIcon = (number) => {
    const icons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6]
    const Icon = icons[number - 1] || Dice1
    return <Icon size={64} />
  }

  // 結果計算
  const calculateFinalRanking = () => {
    return [...teams].sort((a, b) => {
      if (b.stars !== a.stars) return b.stars - a.stars
      if (b.coins !== a.coins) return b.coins - a.coins
      return b.items.length - a.items.length
    })
  }

  // ゲーム終了画面
  if (gameState === GAME_STATES.FINISHED) {
    const ranking = calculateFinalRanking()
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 p-4 flex items-center justify-center">
        <Card className="max-w-2xl w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold text-yellow-600 mb-4">
              🏆 ゲーム終了！ 🏆
            </CardTitle>
            <p className="text-xl text-gray-600">最終結果発表</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {ranking.map((team, index) => {
              const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅'
              const bgColor = index === 0 ? 'bg-yellow-100 border-yellow-300' : 
                             index === 1 ? 'bg-gray-100 border-gray-300' : 
                             index === 2 ? 'bg-orange-100 border-orange-300' : 'bg-blue-100 border-blue-300'
              return (
                <div key={team.id} className={`p-4 rounded-lg border-2 ${bgColor} transform ${index === 0 ? 'scale-105' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-3xl">{medal}</span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-6 h-6 rounded-full"
                            style={{ backgroundColor: team.color }}
                          ></div>
                          <span className="text-xl font-bold">{team.name}</span>
                        </div>
                        <div className="text-sm text-gray-600">第{index + 1}位</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-4 text-lg">
                        <div className="flex items-center space-x-1">
                          <Star className="w-5 h-5 text-yellow-500" />
                          <span className="font-bold">{team.stars}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Coins className="w-5 h-5 text-yellow-600" />
                          <span className="font-bold">{team.coins}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
            
            <div className="text-center space-y-4">
              <p className="text-lg text-gray-600">お疲れ様でした！</p>
              <div className="flex justify-center space-x-4">
                <Button 
                  onClick={() => {
                    setGameState(GAME_STATES.SETUP)
                    setTeams([
                      { id: 1, name: '', color: TEAM_COLORS.RED, position: 0, stars: 0, coins: 0, items: [], skipTurn: false },
                      { id: 2, name: '', color: TEAM_COLORS.BLUE, position: 0, stars: 0, coins: 0, items: [], skipTurn: false },
                      { id: 3, name: '', color: TEAM_COLORS.YELLOW, position: 0, stars: 0, coins: 0, items: [], skipTurn: false }
                    ])
                    setCurrentTeam(0)
                    setGameTimer(45 * 60)
                    setIsTimerRunning(false)
                  }}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  新しいゲームを開始
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // セットアップ画面
  if (gameState === GAME_STATES.SETUP) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="mt-8">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-blue-600">
                マリオカート×双六
              </CardTitle>
              <p className="text-lg text-gray-600">運動自立活動</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <img 
                  src={gameBoardImage} 
                  alt="ゲーム盤" 
                  className="mx-auto rounded-lg shadow-lg max-w-full h-auto"
                />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">チーム名を入力してください</h3>
                {teams.map((team, index) => (
                  <div key={team.id} className="flex items-center space-x-4">
                    <div 
                      className="w-8 h-8 rounded-full"
                      style={{ backgroundColor: team.color }}
                    ></div>
                    <Label htmlFor={`team-${team.id}`} className="w-20">
                      チーム{index + 1}:
                    </Label>
                    <Input
                      id={`team-${team.id}`}
                      value={team.name}
                      onChange={(e) => updateTeamName(team.id, e.target.value)}
                      placeholder="チーム名を入力"
                      className="flex-1"
                    />
                  </div>
                ))}
              </div>
              
              <Button 
                onClick={startGame} 
                className="w-full text-lg py-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                size="lg"
              >
                <span className="text-2xl mr-2">🚀</span>
                ゲーム開始！
                <span className="text-2xl ml-2">🚀</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // ゲーム画面
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-4">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white text-center mb-4">
            マリオカート×双六 運動自立活動
          </h1>
          
          {/* チーム情報 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {teams.map((team, index) => (
              <Card 
                key={team.id} 
                className={`${currentTeam === index ? 'ring-4 ring-yellow-400' : ''} ${team.skipTurn ? 'opacity-50' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div 
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: team.color }}
                    ></div>
                    <span className="font-semibold">{team.name}</span>
                    {currentTeam === index && (
                      <Badge variant="secondary">
                        {team.skipTurn ? '休み' : '現在のターン'}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{team.stars}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Coins className="w-4 h-4 text-yellow-600" />
                      <span>{team.coins}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ShoppingCart className="w-4 h-4 text-blue-600" />
                      <span>{team.items.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* ゲーム盤エリア */}
        <div className="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-2 gap-4 md:gap-6">
          {/* ゲーム盤 */}
          <div className="xl:col-span-2 lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="relative bg-gradient-to-br from-green-100 to-blue-100 rounded-lg p-4">
                  {/* マリオカート風のレーストラック */}
                  <div className="relative w-full h-96 bg-gray-800 rounded-lg overflow-hidden">
                    {/* トラック背景 */}
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700"></div>
                    
                    {/* コースライン */}
                    <div className="absolute inset-2 border-4 border-dashed border-yellow-400 rounded-lg"></div>
                    
                    {/* マス表示 */}
                    {BOARD_SQUARES.map((square, index) => {
                      const angle = (index / BOARD_SQUARES.length) * 2 * Math.PI - Math.PI / 2
                      const radius = 140
                      const x = 50 + (Math.cos(angle) * radius) / 3.84
                      const y = 50 + (Math.sin(angle) * radius) / 3.84
                      
                      const getSquareColor = () => {
                        switch(square.type) {
                          case SQUARE_TYPES.START: return 'bg-yellow-300 border-yellow-500'
                          case SQUARE_TYPES.EXERCISE: return square.difficulty === DIFFICULTY_LEVELS.HARD ? 'bg-red-300 border-red-500' : 'bg-green-300 border-green-500'
                          case SQUARE_TYPES.HAPPENING: return 'bg-purple-300 border-purple-500'
                          case SQUARE_TYPES.RACE: return 'bg-orange-300 border-orange-500'
                          case SQUARE_TYPES.EMPTY: return 'bg-gray-300 border-gray-500'
                          default: return 'bg-white border-gray-400'
                        }
                      }
                      
                      return (
                        <div
                          key={index}
                          className={`absolute w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transform -translate-x-1/2 -translate-y-1/2 ${getSquareColor()}`}
                          style={{
                            left: `${x}%`,
                            top: `${y}%`
                          }}
                          title={square.name}
                        >
                          {index}
                        </div>
                      )
                    })}
                    
                    {/* プレイヤーの位置表示（カート風） */}
                    {teams.map((team, index) => {
                      const angle = (team.position / BOARD_SQUARES.length) * 2 * Math.PI - Math.PI / 2
                      const radius = 140
                      const x = 50 + (Math.cos(angle) * radius) / 3.84
                      const y = 50 + (Math.sin(angle) * radius) / 3.84
                      
                      return (
                        <div
                          key={team.id}
                          className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-in-out"
                          style={{
                            left: `${x}%`,
                            top: `${y}%`,
                            zIndex: 10 + index
                          }}
                        >
                          <div
                            className="w-10 h-6 rounded border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-lg transform hover:scale-110 transition-transform"
                            style={{
                              backgroundColor: team.color,
                              transform: `translate(${index * 4}px, ${index * 4}px) rotate(${angle + Math.PI/2}rad)`
                            }}
                          >
                            🏎️
                          </div>
                          <div className="text-center mt-1 text-xs font-semibold text-white bg-black bg-opacity-50 rounded px-1">
                            {team.name}
                          </div>
                        </div>
                      )
                    })}
                    
                    {/* スターの位置表示 */}
                    {(() => {
                      const angle = (starPosition / BOARD_SQUARES.length) * 2 * Math.PI - Math.PI / 2
                      const radius = 140
                      const x = 50 + (Math.cos(angle) * radius) / 3.84
                      const y = 50 + (Math.sin(angle) * radius) / 3.84
                      
                      return (
                        <div
                          className="absolute transform -translate-x-1/2 -translate-y-1/2"
                          style={{
                            left: `${x}%`,
                            top: `${y}%`,
                            zIndex: 20
                          }}
                        >
                          <Star className="w-8 h-8 text-yellow-400 animate-spin" />
                          <div className="absolute inset-0 animate-ping">
                            <Star className="w-8 h-8 text-yellow-300 opacity-75" />
                          </div>
                        </div>
                      )
                    })()}
                    
                    {/* 中央のロゴエリア */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white bg-opacity-90 rounded-full w-24 h-24 flex items-center justify-center shadow-lg">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">🏁</div>
                          <div className="text-xs font-semibold text-gray-700">マリオ</div>
                          <div className="text-xs font-semibold text-gray-700">すごろく</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* レジェンド */}
                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-yellow-300 border border-yellow-500 rounded"></div>
                      <span>スタート</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-green-300 border border-green-500 rounded"></div>
                      <span>運動（簡単）</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-red-300 border border-red-500 rounded"></div>
                      <span>運動（難しい）</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-purple-300 border border-purple-500 rounded"></div>
                      <span>ハプニング</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-orange-300 border border-orange-500 rounded"></div>
                      <span>レース</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* コントロールパネル */}
          <div className="xl:col-span-1 lg:col-span-1 space-y-4">
            {/* サイコロエリア */}
            <Card>
              <CardHeader>
                <CardTitle>サイコロ {diceCount > 1 && `(${diceCount}個)`}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                {!showDice ? (
                  <div className="space-y-2">
                    <Button 
                      onClick={rollDice}
                      size="lg"
                      className="w-full py-8 text-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                      disabled={teams[currentTeam].skipTurn}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-2xl">🎲</span>
                        <span>{teams[currentTeam].skipTurn ? '1回休み' : 'サイコロを振る'}</span>
                        <span className="text-2xl">🎲</span>
                      </div>
                    </Button>
                    {canRollAgain && (
                      <p className="text-sm text-green-600 font-semibold">
                        もう一度振れます！
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="py-8">
                    <div className="animate-bounce">
                      {getDiceIcon(diceResult || 1)}
                    </div>
                    <p className="mt-2 text-2xl font-bold">{diceResult}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* アイテム使用 */}
            {teams[currentTeam].items.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>アイテム</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {teams[currentTeam].items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2 border rounded">
                      <span>{item.name}</span>
                      <Button 
                        size="sm" 
                        onClick={() => useItem(item.id)}
                        disabled={showDice}
                      >
                        使用
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* アイテムショップ */}
            <Card>
              <CardHeader>
                <CardTitle>アイテムショップ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.values(ITEMS).map(item => (
                  <div key={item.id} className="flex justify-between items-center p-2 border rounded">
                    <div>
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Coins className="w-4 h-4" />
                      <span>{item.price}</span>
                      <Button 
                        size="sm" 
                        onClick={() => buyItem(item.id)}
                        disabled={teams[currentTeam].coins < item.price}
                      >
                        購入
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* ゲーム情報 */}
            <Card>
              <CardHeader>
                <CardTitle>ゲーム情報</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <p>現在のターン: <span className="font-bold text-blue-600">{teams[currentTeam].name}</span></p>
                  <p>スター位置: <span className="font-bold">マス{starPosition}</span></p>
                  <div className="border-t pt-2">
                    <p className="font-semibold mb-1">残り時間:</p>
                    <div className={`text-2xl font-bold text-center p-2 rounded ${gameTimer < 300 ? 'text-red-500 animate-pulse' : gameTimer < 900 ? 'text-yellow-500' : 'text-green-500'}`}>
                      {formatTime(gameTimer)}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-1000 ${
                          gameTimer < 300 ? 'bg-red-500' : 
                          gameTimer < 900 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{
                          width: `${(gameTimer / (45 * 60)) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex justify-center space-x-2 mt-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                    >
                      {isTimerRunning ? '一時停止' : '開始'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setGameTimer(45 * 60)}
                    >
                      リセット
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* サイコロの大画面表示 */}
      {showDice && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-yellow-400 via-red-500 to-pink-500 rounded-3xl p-12 text-center shadow-2xl transform scale-110 animate-pulse">
            <div className="mb-6">
              <div className="text-6xl animate-bounce">🎲</div>
            </div>
            <div className="animate-spin mb-6 filter drop-shadow-lg">
              {getDiceIcon(diceResult || 1)}
            </div>
            <p className="text-5xl font-bold text-white mb-2 animate-pulse">{diceResult}</p>
            <p className="text-lg text-white opacity-90">サイコロの結果!</p>
            <div className="mt-4 flex justify-center space-x-2">
              <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
              <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      )}

      {/* イベントモーダル */}
      <EventModal
        isOpen={eventModal.isOpen}
        onClose={() => {
          setEventModal({ isOpen: false, square: null })
          if (!canRollAgain) {
            nextTurn()
          }
        }}
        square={eventModal.square}
        currentTeam={teams[currentTeam]}
        onMissionComplete={handleMissionComplete}
        onMissionFail={handleMissionFail}
        onRaceResult={handleRaceResult}
        onHappeningComplete={handleHappeningComplete}
      />

      {/* 分岐選択モーダル */}
      <BranchModal
        isOpen={branchModal.isOpen}
        onClose={() => setBranchModal({ isOpen: false, options: null, position: null })}
        currentPosition={branchModal.position}
        branchOptions={branchModal.options}
        onSelectBranch={handleBranchSelect}
      />
    </div>
  )
}

export default App

