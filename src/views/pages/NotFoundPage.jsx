/* eslint-disable react/no-unescaped-entities */
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";

const Container = styled("div")({
	display: "flex",
	justifyContent: "center",
	width: "100%",
	height: "100vh",
	border: "1px solid red",
});

const Content = styled("div")({
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
});

const Title = styled("div")({
	fontSize: 80,
	fontWeight: "bold",
	opacity: 0.9,
	textAlign: "center",
});

const Details = styled("div")({
	width: 500,
	textAlign: "center",
	fontSize: 16,
	opacity: 0.9,
});

function NotFoundPage() {
	return (
		<Container>
			<Content>
				<div>
					<Title>404</Title>
					<Details>
						Oops! Sorry, the page you're looking for doesn't exist. But don't
						worry, try going back to the previous page or visit the{" "}
						<Link to="/">homepage</Link>
					</Details>
				</div>
			</Content>
		</Container>
	);
}

export default NotFoundPage;
