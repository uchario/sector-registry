import { QueryClientProvider, QueryClient } from "react-query";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ToastContainer } from "react-toastify";

import customTheme from "./config/themeConfig";
import BaseRoutes from "./views/routes/BaseRoutes";
import "react-toastify/dist/ReactToastify.css";

function App() {
	const queryClient = new QueryClient();

	return (
		<div id="App">
			<QueryClientProvider client={queryClient}>
				<ThemeProvider theme={customTheme}>
					<ToastContainer />
					<CssBaseline />
					<BaseRoutes />
				</ThemeProvider>
			</QueryClientProvider>
		</div>
	);
}

export default App;
