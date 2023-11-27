import { BrowserRouter, Route, Routes } from "react-router-dom";

import NotFound from "../pages/NotFoundPage";
import Home from "../pages/Home";
import Edit from "../pages/Edit";

const BaseRoute = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/:id" element={<Edit />} />
				<Route path="/" element={<Home />} />

				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
};

export default BaseRoute;
