import { toast } from "react-toastify";

// Function to display a success toast message
export const showSuccessToast = (message) => {
	toast.success(message);
};

// Function to display an error toast message
export const showErrorToast = (message) => {
	toast.error(message);
};

// Function to display an info toast message
export const showInfoToast = (message) => {
	toast.info(message);
};

// Function to display a warning toast message
export const showWarningToast = (message) => {
	toast.warn(message);
};
