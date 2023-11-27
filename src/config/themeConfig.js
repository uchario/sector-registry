import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

const customTheme = createTheme({
	palette: {
		type: "light",
		primary: {
			main: "#002564",
			dark: "#001946",
			light: "#335083",
		},
		secondary: {
			light: "#74a3ce",
			main: "#528DC2",
			dark: "#396287",
		},
		error: {
			main: red[800],
		},
	},
	status: {
		danger: red[500],
	},
	typography: {
		fontFamily: "'Inter','Poppins', 'Roboto', sans-serif",
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				"@global": {
					body: {
						fontFamily: "'Inter','Poppins', 'Roboto', sans-serif",
					},
				},
			},
		},
	},
});

export default customTheme;
