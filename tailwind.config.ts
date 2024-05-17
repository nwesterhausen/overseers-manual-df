import { type Config } from "tailwindcss";

export default {
	darkMode: "media",
	content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {},
	},
	plugins: [require("@tailwindcss/typography"), require("@kobalte/tailwindcss"), require("daisyui")],
	daisyui: {
		themes: [
			{
				dwarf: {
					primary: "#6d3a9c",
					secondary: "#047857",
					accent: "#daa520",
					neutral: "#4b5563",
					"base-100": "#1c1c1c",
					info: "#2463eb",
					success: "#16a249",
					warning: "#db7706",
					error: "#dc2828",
				},
			},
		],
	},
} satisfies Config;
