/** @type {import('tailwindcss').Config} */

import colors from 'tailwindcss/colors';

module.exports = {
	darkMode: 'class',
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		colors: {
			current: 'currentColor',
			transparent: 'transparent',
			white: '#ffffff',
			black: '#000000',
			primary: colors.emerald,
			secondary: colors.rose,
		},
		fontFamily: {
			sans: ['Inter', 'sans-serif'],
		},
		fontSize: {
			xs: ['0.75rem', '1rem'],
			sm: ['0.875rem', '1.25rem'],
			base: ['1rem', '1.75rem'],
			lg: ['1.125rem', '2rem'],
			xl: ['1.25rem', '2.125rem'],
			'2xl': ['1.5rem', '2rem'],
			'3xl': ['1.875rem', '2.375rem'],
			'4xl': ['2.25rem', '2.75rem'],
			'5xl': ['3rem', '3.5rem'],
			'6xl': ['3.75rem', '4.25rem'],
		},
		animation: {
			fade: 'fadeOut 5s ease-out',
		},
		extend: {
			height: {
				'half-screen': '50vh',
			}
		},
		keyframes: {
			fadeOut: {
				'0%': { opacity: 1 },
				'50%': { opacity: 1 },
				'75%': { opacity: 1 },
				'100%': { opacity: 0 },
			},
		},
	},
	plugins: [],
}
