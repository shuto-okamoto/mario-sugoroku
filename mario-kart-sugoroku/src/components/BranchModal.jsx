import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { BOARD_SQUARES } from '../gameData.js'

const BranchModal = ({ isOpen, onClose, currentPosition, branchOptions, onSelectBranch }) => {
  if (!isOpen || !branchOptions) return null

  const handleSelectBranch = (targetPosition) => {
    onSelectBranch(targetPosition)
    onClose()
  }

  const getSquareInfo = (position) => {
    return BOARD_SQUARES.find(square => square.id === position) || { name: `マス${position}` }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="max-w-lg mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">分岐選択</CardTitle>
          <p className="text-gray-600">進む方向を選択してください</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {branchOptions.map((option, index) => {
              const squareInfo = getSquareInfo(option)
              return (
                <Button
                  key={option}
                  onClick={() => handleSelectBranch(option)}
                  className="h-auto p-4 text-left"
                  variant="outline"
                >
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <div className="font-semibold">
                        {index === 0 ? '左のルート' : '右のルート'}
                      </div>
                      <div className="text-sm text-gray-600">
                        マス{option}: {squareInfo.name}
                      </div>
                    </div>
                    {index === 0 ? (
                      <ArrowLeft className="w-6 h-6" />
                    ) : (
                      <ArrowRight className="w-6 h-6" />
                    )}
                  </div>
                </Button>
              )
            })}
          </div>
          
          <div className="text-center text-sm text-gray-500 mt-4">
            現在位置: マス{currentPosition}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default BranchModal

