import * as yup from "yup";

const registerSchema = yup.object().shape({

    email: yup.string().email().required("Email is required"),

    username: yup.string()
    .matches(/^(?=.*[a-z])[a-z0-9._]{2,25}$/, 
        "Username must be 2-25 characters, contain at least one lowercase letter, and only include lowercase letters, dots, numbers, and underscores.")
    .required("Username is required"),

    password1: yup.string()
    .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{1,20}$/, 
        "At least one uppercase letter, one digit, one special character, at most 20 characters.")
    .required("Password is required"),

    password2: yup.string()
        .oneOf([yup.ref("password1"), null], "Passwords doesn`t match")
        .required("Confirm Password is required"),


});

export default registerSchema;
