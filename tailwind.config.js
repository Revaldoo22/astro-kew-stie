/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './node_modules/flowbite/**/*.js'
  ],
  darkMode: 'class',
  theme: {
    extend: {
    //   colors: {
        // blue: {
        //   50: '#f0f4f8',
        //   100: '#d9e2ec',
        //   200: '#bcccdc',
        //   300: '#9fb3c8',
        //   400: '#829ab1',
        //   500: '#627d98',
        //   600: '#486581',
        //   700: '#334e68',
        //   800: '#243b53',
        //   900: '#102a43',
        //   950: '#0a1c2e',
        //   // Override default blue colors with your custom color
        //   DEFAULT: '#212f55',
        //   500: '#212f55',
        //   600: '#1a2a4a',
        //   700: '#15203a',
        //   800: '#0f1a2a',
        //   900: '#0a121a',
        // }
    //   }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}
