import React, { useState } from 'react'

import TzButtonPressed from '../../logos/tzbutton-logo-pressed.svg'
import TzButtonUnpressed from '../../logos/tzbutton-logo-unpressed.svg'

const TzButton: React.FC = () => {
  const [isPressed, setIsPressed] = useState(false)

  return (
    <img
      style={{ cursor: 'pointer' }}
      src={isPressed ? TzButtonPressed : TzButtonUnpressed}
      onMouseEnter={() => setIsPressed(true)}
      onMouseLeave={() => setIsPressed(false)}
      width="200px"
      height="200px"
      alt="TzButton - click to participate"
    />
  )
}

export default TzButton
