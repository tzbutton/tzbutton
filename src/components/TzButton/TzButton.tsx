import React from 'react'
import { Box } from '@chakra-ui/core'

type LightOrDark = 'light' | 'dark'

function lightOrDark(hex: string): LightOrDark {
  const r = '0x' + hex[1] + hex[2]
  const g = '0x' + hex[3] + hex[4]
  const b = '0x' + hex[5] + hex[6]

  const colors = {
    r: +r,
    g: +g,
    b: +b,
  }

  // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
  const hsp = Math.sqrt(
    0.299 * (colors.r * colors.r) +
      0.587 * (colors.g * colors.g) +
      0.114 * (colors.b * colors.b)
  )

  // Using the HSP value, determine whether the color is light or dark
  if (hsp > 160) {
    return 'light'
  } else {
    return 'dark'
  }
}

function ColorLuminance(hex: string, lum: number) {
  // validate hex string
  hex = String(hex).replace(/[^0-9a-f]/gi, '')
  if (hex.length < 6) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  }
  lum = lum || 0

  // convert to decimal and change luminosity
  var rgb = '#',
    c,
    i
  for (i = 0; i < 3; i++) {
    c = parseInt(hex.substr(i * 2, 2), 16)
    c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16)
    rgb += ('00' + c).substr(c.length)
  }

  return rgb
}

const TzButton: any = (props: any) => {
  const color = props.color ?? { symbol: '#484fc5' }
  const isHovered = props.ishovered === 'true'
  const brightness = lightOrDark(color.symbol)
  const baseFactor = 0.7 // Higher number = more contrast
  const colorShift = isHovered ? -0.2 : 0.1 // Positive = brighter / negative = darker

  const tzButtonIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 88.7 78.1"
      {...props}
      stroke={brightness === 'light' ? 'grey' : 'white'}
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
        <stop
          offset="0"
          stopColor={ColorLuminance(
            color.symbol,
            0.9 * baseFactor + colorShift
          )}
        />
        <stop
          offset=".023"
          stopColor={ColorLuminance(
            color.symbol,
            0.8 * baseFactor + colorShift
          )}
        />
        <stop
          offset=".092"
          stopColor={ColorLuminance(
            color.symbol,
            0.5 * baseFactor + colorShift
          )}
        />
        <stop
          offset=".168"
          stopColor={ColorLuminance(
            color.symbol,
            0.4 * baseFactor + colorShift
          )}
        />
        <stop
          offset=".251"
          stopColor={ColorLuminance(
            color.symbol,
            0.1 * baseFactor + colorShift
          )}
        />
        <stop
          offset=".344"
          stopColor={ColorLuminance(
            color.symbol,
            -0.1 * baseFactor + colorShift
          )}
        />
        <stop
          offset=".452"
          stopColor={ColorLuminance(
            color.symbol,
            -0.3 * baseFactor + colorShift
          )}
        />
        <stop
          offset=".59"
          stopColor={ColorLuminance(
            color.symbol,
            -0.4 * baseFactor + colorShift
          )}
        />
        <stop
          offset=".858"
          stopColor={ColorLuminance(
            color.symbol,
            -0.5 * baseFactor + colorShift
          )}
        />
        <stop
          offset="1"
          stopColor={ColorLuminance(
            color.symbol,
            -0.7 * baseFactor + colorShift
          )}
        />
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
        <stop
          offset=".136"
          stopColor={ColorLuminance(
            color.symbol,
            0.4 * baseFactor + colorShift
          )}
        />
        <stop
          offset=".348"
          stopColor={ColorLuminance(
            color.symbol,
            0.1 * baseFactor + colorShift
          )}
        />
        <stop
          offset=".722"
          stopColor={ColorLuminance(color.symbol, 0 * baseFactor + colorShift)}
        />
        <stop
          offset="1"
          stopColor={ColorLuminance(
            color.symbol,
            -0.1 * baseFactor + colorShift
          )}
        />
      </radialGradient>
      <ellipse
        stroke="none"
        cx="43.5"
        cy="37.2"
        fill="url(#b)"
        rx="30.7"
        ry="29.8"
      />
      <g fill="none" stroke="colorstroke" strokeWidth="2.835" opacity=".82">
        <path
          strokeLinejoin="bevel"
          d="M28 28.6h25.7L42.4 40.3c2.8-2.5 12.2-3.3 14.8 5.2 1.8 6.1-2.6 12.5-8.8 14.6-4.2 1.4-8.7 1.3-12.9-.1C23 55.6 16.4 41.9 20.8 29.3s18.1-19.1 30.6-14.7C61 18 67.5 27 67.5 37.2c0 13.2-11.3 23.9-24.6 23.9"
        />
        <path
          strokeMiterlimit="10"
          d="M35.6 20.8v22.8c0 5.4 2.8 8.2 6.4 8.2h0c1.4 0 2.8-.5 4-1.4"
        />
      </g>
    </svg>
  )

  return (
    <Box
      style={{ cursor: 'pointer' }}
      as={tzButtonIcon}
      w="200px"
      h="200px"
    ></Box>
  )
}

export default TzButton
