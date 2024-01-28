import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      gridTemplateRows: {
        'layout': 'auto auto 1fr',
      },
    },
  },
  plugins: [],
} satisfies Config

