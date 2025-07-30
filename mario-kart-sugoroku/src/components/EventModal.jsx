import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  Dumbbell, 
  Trophy, 
  AlertTriangle, 
  Car,
  Coins,
  Star,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { 
  SQUARE_TYPES, 
  EXERCISE_MISSIONS, 
  HAPPENING_EVENTS, 
  RACE_EVENTS 
} from '../gameData.js'

const EventModal = ({ 
  isOpen, 
  onClose, 
  square, 
  currentTeam, 
  onMissionComplete, 
  onMissionFail,
  onRaceResult,
  onHappeningComplete
}) => {
  const [missionResult, setMissionResult] = useState(null)
  const [raceResults, setRaceResults] = useState(null)

  if (!isOpen || !square) return null

  const handleMissionSuccess = () => {
    setMissionResult('success')
    onMissionComplete(square.coins || 0)
  }

  const handleMissionFail = () => {
    setMissionResult('fail')
    onMissionFail()
  }

  const handleRaceComplete = (position) => {
    const rewards = RACE_EVENTS.rewards
    let coins = 0
    if (position === 1) coins = rewards.first
    else if (position === 2) coins = rewards.second
    else if (position === 3) coins = rewards.third

    setRaceResults({ position, coins })
    onRaceResult(coins)
  }

  const handleHappeningOk = () => {
    onHappeningComplete(square.event)
    onClose()
  }

  const handleClose = () => {
    setMissionResult(null)
    setRaceResults(null)
    onClose()
  }

  // 運動ミッションモーダル
  if (square.type === SQUARE_TYPES.EXERCISE) {
    const mission = EXERCISE_MISSIONS[square.exercise][square.difficulty]
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <Dumbbell className="w-12 h-12 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">{mission.name}</CardTitle>
            <Badge variant={square.difficulty === 'easy' ? 'secondary' : 'destructive'}>
              {square.difficulty === 'easy' ? '簡単' : '難しい'}
            </Badge>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-lg">{mission.description}</p>
            <div className="flex items-center justify-center space-x-2">
              <Coins className="w-5 h-5 text-yellow-500" />
              <span className="text-lg font-semibold">{square.coins}コイン獲得</span>
            </div>
            
            {missionResult === null && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">ミッションを実行してください</p>
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleMissionSuccess}
                    className="flex-1"
                    variant="default"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    成功
                  </Button>
                  <Button 
                    onClick={handleMissionFail}
                    className="flex-1"
                    variant="outline"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    失敗
                  </Button>
                </div>
              </div>
            )}
            
            {missionResult === 'success' && (
              <div className="space-y-2">
                <div className="text-green-600 font-semibold">
                  <CheckCircle className="w-6 h-6 mx-auto mb-2" />
                  ミッション成功！
                </div>
                <p>{square.coins}コインを獲得しました！</p>
                <p className="text-sm text-blue-600">もう一度サイコロを振れます</p>
                <Button onClick={handleClose} className="w-full">
                  続ける
                </Button>
              </div>
            )}
            
            {missionResult === 'fail' && (
              <div className="space-y-2">
                <div className="text-red-600 font-semibold">
                  <XCircle className="w-6 h-6 mx-auto mb-2" />
                  ミッション失敗
                </div>
                <p>コインは獲得できませんでした</p>
                <Button onClick={handleClose} className="w-full" variant="outline">
                  続ける
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // ハプニングモーダル
  if (square.type === SQUARE_TYPES.HAPPENING) {
    const happening = HAPPENING_EVENTS[square.event]
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <AlertTriangle className="w-12 h-12 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-red-600">ハプニング！</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <h3 className="text-xl font-semibold">{happening.name}</h3>
            <p className="text-lg">{happening.description}</p>
            <Button onClick={handleHappeningOk} className="w-full">
              了解
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // レースモーダル
  if (square.type === SQUARE_TYPES.RACE) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <Car className="w-12 h-12 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">{RACE_EVENTS.name}</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-lg">{RACE_EVENTS.description}</p>
            
            {raceResults === null && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">レース結果を選択してください</p>
                <div className="space-y-2">
                  <Button 
                    onClick={() => handleRaceComplete(1)}
                    className="w-full"
                    variant="default"
                  >
                    <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
                    1位 ({RACE_EVENTS.rewards.first}コイン)
                  </Button>
                  <Button 
                    onClick={() => handleRaceComplete(2)}
                    className="w-full"
                    variant="outline"
                  >
                    <Trophy className="w-4 h-4 mr-2 text-gray-400" />
                    2位 ({RACE_EVENTS.rewards.second}コイン)
                  </Button>
                  <Button 
                    onClick={() => handleRaceComplete(3)}
                    className="w-full"
                    variant="outline"
                  >
                    <Trophy className="w-4 h-4 mr-2 text-orange-600" />
                    3位 ({RACE_EVENTS.rewards.third}コイン)
                  </Button>
                </div>
              </div>
            )}
            
            {raceResults && (
              <div className="space-y-2">
                <div className="font-semibold">
                  <Trophy className="w-6 h-6 mx-auto mb-2" />
                  {raceResults.position}位！
                </div>
                <p>{raceResults.coins}コインを獲得しました！</p>
                <Button onClick={handleClose} className="w-full">
                  続ける
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}

export default EventModal

