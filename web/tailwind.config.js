/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/admin/**/*.{js,jsx}", "./components/admin/**/*.{js,jsx}"],
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        /* ชุดสีจาก DESIGN.md ที่ Stitch ส่งออกมา ตรงกับสีแบรนด์ของเว็บหน้าบ้าน */
        ink: "#0E1A14",
        "ink-2": "#5C6B62",
        "ink-3": "#8B9990",
        line: "#E7EAE4",
        ground: "#F6F8F5",
        brand: { DEFAULT: "#018438", dark: "#00682A", tint: "#E7F3EC", deep: "#06351F" },
        amber: { DEFAULT: "#9A6407", tint: "#FBF0DC" },
        danger: { DEFAULT: "#BA1A1A", tint: "#FFDAD6" },
      },
      fontFamily: {
        sans: ["'IBM Plex Sans Thai'", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 2px 4px rgba(0,0,0,.04)",
        pop: "0 8px 16px rgba(0,0,0,.08)",
      },
      borderRadius: { card: "12px" },
    },
  },
  plugins: [],
};
