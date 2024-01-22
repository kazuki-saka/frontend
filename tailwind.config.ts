import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";
import headlessui from "@headlessui/tailwindcss";

// フォントサイズのpx->rem計算用関数
const fontSize = Object.fromEntries(
  [...Array(300)].map((_, index) => { 
    const px = index + 10;
    return [`${ px }ptr`, `${ px / 16 }rem`]
  })
);

const config: Config = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    container: {
      center: true,
    },
    fontFamily: {
      notosansjp: ["Noto Sans JP", "sans-serif"],
      roboto: ["Roboto", "sans-serif"],
      arial: ["Arial", "sans-serif"],
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      error: {
        DEFAULT: "#a05469",
        100: "#f3e4e7",
      },
      button: {
        DEFAULT: "#003372",
      },
      black: colors.black,
      white: colors.white,
      gray: {
        ...colors.gray,
        100: "#f0f3f5",
        //#f0f3f5
      },
      blue: {
        DEFAULT: "#0064be",
        ...colors.blue
      },
      red: colors.red,
      yellow: colors.yellow,
    },
    extend: {
      fontSize: fontSize,
    },
  },
  plugins: [headlessui],
  darkMode: "class",
  important: true,
};
export default config;