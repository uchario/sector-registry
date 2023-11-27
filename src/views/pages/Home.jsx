import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { useQuery } from "react-query";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Checkbox from "@mui/material/Checkbox";
import ListSubheader from "@mui/material/ListSubheader";
import { Typography, Button, CircularProgress } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import request from "../../api/httpService";
import config from "../../config";
import { showErrorToast, showSuccessToast } from "../../utils/toastHelper";
import TextFieldComponent from "../../components/common/TextFieldComponent";
import mask from "../../assets/images/mask.png";

const { apiHost } = config().secrets;

const formStyle = {
	padding: {
		md: "4rem 3rem 3rem 3rem",
		xs: "1rem",
	},
	width: "40rem",
	maxWidth: "100%",
};

const buttonStyle = {
	textTransform: "capitalize",
	fontSize: "1rem",
	fontWeight: 600,
	px: "2.5rem",
	borderRadius: "3.75rem",
};

const formContainer = {
	display: "flex",
	justifyContent: "center",
};

const Container = styled("div")({
	height: "100vh",
	width: "100%",
	background: "linear-gradient(to bottom, #002564 40%, #ededed 40%)",
	padding: "4rem",
	"@media screen and (max-width: 768px)": {
		padding: "1rem",
	},
});

const MainContent = styled("div")({
	// display: 'flex',
	// justifyContent: 'center',
	// border: '2px solid red',
	// height: '100%',
	// width: '100%',
});

const MainContainer = styled("div")({
	backgroundColor: "#fff",
	margin: "0 auto",
	width: "90rem",
	maxWidth: "90%",
	borderRadius: "1.25rem",
});

const MaskContainer = styled("div")({
	height: "4rem",
	borderRadius: "0 0 1.25rem 1.25rem",
});

const Mask = styled("img")({
	height: "100%",
	width: "100%",
	objectFit: "cover",
	borderRadius: "0 0 1.25rem 1.25rem",
});

const FormItemContainer = styled("div")({
	display: "flex",
	justifyContent: "center",
	marginBottom: "2rem",
});

function MyListSubheader(props) {
	return <ListSubheader {...props} />;
}

MyListSubheader.muiSkipListHighlight = true;

const fetchAllSectors = async () => {
	const { data } = await request.get(`${apiHost}/api/sectors`);
	return data;
};

const findSelectedOption = (data, valueToFind) => {
	for (let option of data) {
		if (option.value === valueToFind) {
			return option;
		} else if (option.children) {
			const foundInChildren = findSelectedOption(option.children, valueToFind);
			if (foundInChildren) {
				return foundInChildren;
			}
		}
	}
	return null;
};

const initialFormDetails = {
	name: "",
	sectors: [],
	agree: false,
	userId: "",
};

const Home = () => {
	// const [value, setValue] = useState("");
	const [loading, setLoading] = useState(false);
	const [formDetails, setFormDetails] = useState(initialFormDetails);
	const [isFormSubmitted, setIsFormSubmitted] = useState(false);
	const [submittedData, setSubmittedData] = useState({});
	const [errors, setErrors] = useState({});

	const {
		data: allSectors = [],
		// isLoading: allSectorsLoading,
		isError: allSectorsError,
		error: allSectorsErrorMessage,
	} = useQuery(["get-all-sectors"], async () => fetchAllSectors(), {
		select: (data) => data?.data,
		staleTime: 4 * 60 * 1000,
	});

	useEffect(() => {
		if (allSectorsError) {
			if (allSectorsErrorMessage.response) {
				showErrorToast(allSectorsErrorMessage.response.data?.message);
			} else if (allSectorsErrorMessage.request) {
				showErrorToast("Network Error");
			} else {
				showErrorToast("Error", allSectorsErrorMessage.message);
			}
		}
	}, [allSectorsError, allSectorsErrorMessage]);

	const handleChange = (event) => {
		const { name, value, type, checked } = event.target;

		if (type === "checkbox") {
			// Handle checkbox changes
			setFormDetails((prevState) => ({
				...prevState,
				[name]: checked,
			}));
			setErrors((prevState) => ({
				...prevState,
				[name]: "",
			}));
		} else {
			// Handle text field changes
			setFormDetails((prevState) => ({
				...prevState,
				[name]: value,
			}));
			setErrors((prevState) => ({
				...prevState,
				[name]: "",
			}));
		}
	};

	const validateForm = () => {
		const newErrors = {};

		if (formDetails.name.trim() === "") {
			newErrors.name = "Name is required";
		}

		if (formDetails.sectors.length === 0) {
			newErrors.sector = "Sector is required";
		}

		if (!formDetails.agree) {
			newErrors.agree = "You must agree tot terms to continue";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		try {
			e.preventDefault();
			const isValid = validateForm();
			if (!isValid) {
				return;
			}
			setLoading(true);

			const payload = {
				...formDetails,
				userId: uuidv4(),
				sectors: formDetails.sectors?.map((sector) =>
					findSelectedOption(allSectors, sector)
				),
			};
			const { data } = await request.post(`${apiHost}/api/formEntry`, payload);
			setSubmittedData(data.data);
			showSuccessToast("Form submitted successfully");
			setIsFormSubmitted(true);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			if (error.response) {
				showErrorToast(error.response.data?.message);
			} else if (error.request) {
				showErrorToast("Internal Server Error");
			} else {
				showErrorToast("Error", error.message);
			}
		}
	};

	const renderOptions = (data) => {
		const options = [];

		const render = (optionsData, depth = 0) => {
			optionsData.forEach((option) => {
				if (option.children) {
					options.push(
						<ListSubheader
							key={option.value}
							disableSticky
							sx={{ pl: depth * 2 + 2 }}
						>
							{option.label}
						</ListSubheader>
					);
					render(option.children, depth + 1);
				} else {
					options.push(
						<MenuItem
							key={option.value}
							value={option.value}
							sx={{ pl: depth * 2 + 2 }}
						>
							{option.label}
						</MenuItem>
					);
				}
			});
		};

		render(data);
		return options;
	};

	return (
		<Container>
			<MainContent>
				<Typography
					variant="h6"
					compoent="h1"
					sx={{
						mb: "1rem",
						textAlign: "center",
						color: "#fff",
						fontWeight: 600,
					}}
				>
					Sector Registry
				</Typography>

				<MainContainer>
					<Box sx={formContainer}>
						<Box
							component="form"
							noValidate
							autoComplete="off"
							onSubmit={handleSubmit}
							sx={formStyle}
						>
							<Typography
								variant="body1"
								textAlign="center"
								fontWeight={500}
								sx={{ mb: "2rem" }}
							>
								Kindly fill the form below:
							</Typography>

							<FormItemContainer>
								<TextFieldComponent
									value={formDetails.name}
									onChange={handleChange}
									label="Name"
									id="name"
									name="name"
									helperText={!!errors.name && errors.name}
									error={!!errors.name}
								/>
							</FormItemContainer>
							<FormItemContainer>
								<FormControl fullWidth required error={!!errors.sector}>
									<InputLabel id="sector-label">Sector</InputLabel>
									<Select
										labelId="sectors-label"
										id="sectors"
										name="sectors"
										value={formDetails.sectors}
										label="Sector"
										onChange={handleChange}
										sx={{ textTransform: "none" }}
										multiple
									>
										{renderOptions(allSectors)}
									</Select>
									{!!errors.sector && (
										<FormHelperText error={!!errors.sector}>
											{errors.sector}
										</FormHelperText>
									)}
								</FormControl>
							</FormItemContainer>

							<FormItemContainer>
								<div>
									<FormControlLabel
										required
										control={<Checkbox />}
										label="Agree to terms"
										checked={formDetails.agree}
										onChange={handleChange}
										name="agree"
									/>
									{!!errors.agree && (
										<FormHelperText error={!!errors.agree}>
											{errors.agree}
										</FormHelperText>
									)}
								</div>
							</FormItemContainer>

							<FormItemContainer>
								<Button
									variant="contained"
									type="submit"
									disabled={loading}
									sx={buttonStyle}
								>
									{loading ? <CircularProgress size="1.5rem" /> : "save"}
								</Button>

								{isFormSubmitted && (
									<Button
										sx={{
											...buttonStyle,
											ml: "1rem",
										}}
										variant="contained"
										component={Link}
										to="/edit"
										state={submittedData}
									>
										edit
									</Button>
								)}
							</FormItemContainer>
						</Box>
					</Box>

					<MaskContainer>
						<Mask src={mask} alt="mask" />
					</MaskContainer>
				</MainContainer>
			</MainContent>
		</Container>
	);
};

export default Home;
