import ReAct, { useEffect } from 'react'
import './side.scss'
import type { SideChoiceProps } from './types.ts'
import { Choice } from '../../views/choice/choice'
import { Whice } from '../whice/whice.tsx'
import { Blace } from '../blace/blace.tsx'
import { Random } from '../../views/random/random'
import { Back } from '../../views/back/back'

export const SideChoice: ReAct.FC<SideChoiceProps> = ({ onChoose, onRandom, onBack }) => {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onBack()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onBack])

  const handleOverlayClick = (e: ReAct.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onBack()
  }

  return (
    <div
      className="side-choice-overlay"
      onClick={handleOverlayClick}
      data-testid="side-choice-overlay"
    >
      <div
        className="side-choice"
        data-testid="side-choice"
        role="dialog"
        aria-modal="true"
        aria-labelledby="side-choice-title"
      >
        <Choice />
          <p className="side-choice__subtitle">
            За кого будешь играть?
          </p>

        <div className="side-choice__cards">
          <Whice onChoose={onChoose} />
            <Blace onChoose={onChoose} />
        </div>

        <div className="side-choice__actions">
          <Random onRandom={onRandom} />
            <Back onBack={onBack} />
        </div>
      </div>
    </div>
  )
}