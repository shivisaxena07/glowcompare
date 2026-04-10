import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#FAFAF8',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          outline: '2px solid #0F172A',
          gap: 1,
        }}
      >
        <span
          style={{
            color: '#0F172A',
            fontSize: 14,
            fontWeight: 800,
            fontFamily: 'sans-serif',
            letterSpacing: '-0.5px',
          }}
        >
          G
        </span>
        <span
          style={{
            background: '#FF2D95',
            color: '#ffffff',
            fontSize: 14,
            fontWeight: 800,
            fontFamily: 'sans-serif',
            letterSpacing: '-0.5px',
            padding: '0 2px',
          }}
        >
          C
        </span>
      </div>
    ),
    { ...size }
  )
}
