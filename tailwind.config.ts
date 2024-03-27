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
      screens: {
        sm: "544px",
        md: "768px",
        lg: "984px",
        xl: "1024px",
        "2xl": "1280px",
      },
      padding: {
        DEFAULT: "1rem",
        sm: "1rem",
        lg: "0rem",
        xl: "0rem",
        "2xl": "0rem",
      },
    },
    fontFamily: {
      "notosansjp": ["Noto Sans JP", "sans-serif"],
      "notoserifjp": '"Noto Serif JP", sans-serif',
      "roboto": ["Roboto", "sans-serif"],
      "arial": ["Arial", "sans-serif"],
      "meiryo": ["メイリオ", "sans-serif"],
      "hiraginosans": ["Hiragino Sans", "sans-serif"],
      "hiraginokakugothic": ["ヒラギノ角ゴシック", "sans-serif"],
      "yugothic": ["YuGothic", "Yu Gothic", "sans-serif"],
      "mincho": '"游明朝体", YuMincho, "游明朝", "Yu Mincho", serif',
      "gothic": `"游ゴシック体", "Yu Gothic", YuGothic, "ヒラギノ角ゴ Pro", "Hiragino Kaku Gothic Pro", "メイリオ", Meiryo, "MS Pゴシック", "MS PGothic", sans-serif`,
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: colors.black,
      white: colors.white,
      red: colors.red,
      gray: {
        ...colors.gray,
        100: "#f0f3f5",
        //#f0f3f5
      },
      blue: {
        DEFAULT: "#0064be",
        ...colors.blue,
        250: "#dae2ea",
        550: "#294c81",
        1000: "#0064be",
      },
      yellow: {
        ...colors.yellow,
        550: "#d6c821",
      },
      error: {
        DEFAULT: "#a05469",
        100: "#f3e4e7",
      },
      button: {
        DEFAULT: "#003372",
      },
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