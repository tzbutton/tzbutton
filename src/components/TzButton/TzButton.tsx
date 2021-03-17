import React, { useState } from 'react'
import { Box } from '@chakra-ui/core'

import TzButtonPressed from '../../logos/tzbutton-logo-pressed.svg'
import TzButtonUnpressed from '../../logos/tzbutton-logo-unpressed.svg'

const TzButton: React.FC = () => {
  const tzButtonIcon = (props: any) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 88.7 78.1"
      {...props}
      stroke="red"
    >
      <defs />
      <ellipse
        stroke="none"
        cx="45.1"
        cy="40.9"
        fill="#959595"
        rx="33.6"
        ry="32.6"
      />
      <linearGradient
        stroke="none"
        id="a"
        x1="20.11"
        x2="66.879"
        y1="66.224"
        y2="19.455"
        gradientTransform="matrix(1 0 0 -1 0 80)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stop-color="#979bde" />
        <stop offset=".023" stop-color="#8a8eda" />
        <stop offset=".092" stop-color="#666cce" />
        <stop offset=".168" stop-color="#484fc5" />
        <stop offset=".251" stop-color="#2f38bd" />
        <stop offset=".344" stop-color="#1c25b7" />
        <stop offset=".452" stop-color="#0f19b2" />
        <stop offset=".59" stop-color="#0711b0" />
        <stop offset=".858" stop-color="#050faf" />
        <stop offset="1" stop-color="#050faf" />
      </linearGradient>
      <ellipse
        stroke="none"
        cx="43.5"
        cy="37.2"
        fill="url(#a)"
        rx="33.6"
        ry="32.6"
      />
      <radialGradient
        stroke="none"
        id="b"
        cx="39.712"
        cy="32.397"
        r="30.282"
        fx="58.814"
        fy="52.053"
        gradientTransform="matrix(.9998 -.0175 -.0169 -.9699 4.338 69.277)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset=".136" stop-color="#474dc9" />
        <stop offset=".348" stop-color="#3c42cc" />
        <stop offset=".722" stop-color="#1e26d3" />
        <stop offset="1" stop-color="#040dd9" />
      </radialGradient>
      <ellipse
        stroke="none"
        cx="43.5"
        cy="37.2"
        fill="url(#b)"
        rx="30.7"
        ry="29.8"
      />
      <g fill="none" stroke="colorstroke" stroke-width="2.835" opacity=".82">
        <path
          stroke-linejoin="bevel"
          d="M28 28.6h25.7L42.4 40.3c2.8-2.5 12.2-3.3 14.8 5.2 1.8 6.1-2.6 12.5-8.8 14.6-4.2 1.4-8.7 1.3-12.9-.1C23 55.6 16.4 41.9 20.8 29.3s18.1-19.1 30.6-14.7C61 18 67.5 27 67.5 37.2c0 13.2-11.3 23.9-24.6 23.9"
        />
        <path
          stroke-miterlimit="10"
          d="M35.6 20.8v22.8c0 5.4 2.8 8.2 6.4 8.2h0c1.4 0 2.8-.5 4-1.4"
        />
      </g>
    </svg>
  )
  const [isPressed, setIsPressed] = useState(false)

  return <Box as={tzButtonIcon} w="200px" h="200px"></Box>
}

export default TzButton
