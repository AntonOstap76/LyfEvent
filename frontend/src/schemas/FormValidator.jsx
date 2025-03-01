import * as yup from "yup";

const basicSchema = yup.object().shape({
    title: yup
    .string()
    .max(50, "Title cannot exceed 50 characters")
    .matches(/^[a-zA-Z0-9 ]*$/, "Only letters, numbers, and spaces are allowed")
    .required("Title is required"),

    date: yup
    .date()
    .required("Date is required")
    .min(new Date(), "Date must be today or later"),
      
        
    description: yup
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .required("Description is required"),
    
    location: yup
    .string()
    .max(50, "Location cannot exceed 50 characters")
    .matches(/^[a-zA-Z0-9 ]*$/, "Only letters, numbers, and spaces are allowed")
    .required("Location is required"),
    
    image: yup.mixed().required("Image is required"), // For file input use mixed()
    
    capacity: yup
        .number()
        .positive("Capacity must be a positive number")
        .integer("Capacity must be a whole number")
        .required("Capacity is required"),
    
    category: yup.string().required("Category is required"),


});

export default basicSchema;
