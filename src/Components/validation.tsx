import * as Yup from "yup";
import { localized } from "../locales/localization";

//signup form
export const signupSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .matches(
      /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,15}$/,
      "Name must be in correct format & max length 15"
    ),
  email: Yup.string()
    .email(`${localized.t("Please enter valid email")}`)
    .required(`${localized.t("Email is required")}`),
  password: Yup.string()
    .trim()
    .matches(
      /\w*[a-z]\w*/,
      `${localized.t("Password must have a small letter")}`
    )
    .matches(
      /\w*[A-Z]\w*/,
      `${localized.t("Password must have a capital letter")}`
    )
    .matches(/\d/, `${localized.t("Password must have a number")}`)
    .matches(
      /[!@#$%^&*()\-_"=+{}; :,<.>]/,
      `${localized.t("Password must have a special character")}`
    )
    .min(
      6,
      ({ min }) =>
        `${localized.t("Password must be at least")} ${min} ${localized.t(
          "characters"
        )}`
    )
    .required(`${localized.t("Password is required")}`),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], `${localized.t("Passwords do not match")}`)
    .required(`${localized.t("Confirm password is required")}`),
});

//   login form
export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email(`${localized.t("Please enter valid email")}`)
    .required(`${localized.t("Email is required")}`),
  password: Yup.string()
    .trim()
    .matches(
      /\w*[a-z]\w*/,
      `${localized.t("Password must have a small letter")}`
    )
    .matches(
      /\w*[A-Z]\w*/,
      `${localized.t("Password must have a capital letter")}`
    )
    .matches(/\d/, `${localized.t("Password must have a number")}`)
    .matches(
      /[!@#$%^&*()\-_"=+{}; :,<.>]/,
      `${localized.t("Password must have a special character")}`
    )
    .min(
      6,
      ({ min }) =>
        `${localized.t("Password must be at least")} ${min} ${localized.t(
          "characters"
        )}`
    )
    .required(`${localized.t("Password is required")}`),
});

//post event form

export const postEventSchema = Yup.object().shape({
  eventName: Yup.string()
    .required(`${localized.t("Event Name is required")}`)
    .matches(/\w*[a-z]\w*/, `${localized.t("Only alphabets are allowed")}`),
  address: Yup.string()
    .required(`${localized.t("Address is required")}`)
    .matches(/\w*[a-z]\w*/, `${localized.t("Only alphabets are allowed")}`),
  served: Yup.string()
    .required(`${localized.t("This field is required")}`)
    .min(
      6,
      ({ min }) =>
        `${localized.t("This field must be at least")} ${min} ${localized.t(
          "characters"
        )}`
    )
    .matches(/\w*[a-z]\w*/, `${localized.t("Only alphabets are allowed")}`),
  volunteers: Yup.string().matches(
    /^[0-9]{1,3}$/,
    `${localized.t("Please enter a valid volunteer number")}`
  ),
});

//post event form

export const AddDonations = Yup.object().shape({
  foodItem: Yup.string()
    .required(`${localized.t("Name is required")}`)
    .matches(/\w*[a-z]\w*/, `${localized.t("Only alphabets are allowed")}`),
  quantity: Yup.string().required(`${localized.t("This field is required")}`),
  // .matches(/^[a-zA-Z0-9]+$/, 'Only alphanumeric characters are allowed'),
  address: Yup.string()
    .required(`${localized.t("Address is required")}`)
    .matches(/\w*[a-z]\w*/, `${localized.t("Only alphabets are allowed")}`),
  phoneNumber: Yup.string()
    .required(`${localized.t("This field is required")}`)
    .matches(/^[0-9]+$/, {
      message: `${localized.t("Only numbers are allowed")}`,
      excludeEmptyString: true,
    }),
  flatNo: Yup.string()
    .required(`${localized.t("This field is required")}`)
    .matches(/^[0-9]+$/, {
      message: `${localized.t("Only numbers are allowed")}`,
      excludeEmptyString: true,
    }),
  zipCode: Yup.string()
    .required(`${localized.t("This field is required")}`)
    .matches(/^[0-9]+$/, {
      message: `${localized.t("Only numbers are allowed")}`,
      excludeEmptyString: true,
    })
    .min(6, ({ min }) => `${localized.t("This field must be at least")} ${min} ${localized.t("characters")}`),
});

//addVolunteerATAnEvent

export const addVolunteer = Yup.object().shape({
  name: Yup.string()
    .required(`${localized.t("Volunteer Name is required")}`)
    .matches(/\w*[a-z]\w*/, `${localized.t("Only alphabets are allowed")}`),
    // volunteerFullAddress: Yup.string()
    // .required("Address is required")
  //   // .matches(/\w*[a-z]\w*/, "Only alphabets are allowed"),
  // address: Yup.string()
  //   .required(`${localized.t("Address is required")}`)
  //   .matches(/\w*[a-z]\w*/, `${localized.t("Only alphabets are allowed")}`),
  phoneNumber: Yup.string()
    .required(`${localized.t("This field is required")}`)
    .matches(/^[0-9]+$/, {
      message: `${localized.t("Only numbers are allowed")}`,
      excludeEmptyString: true,
    }),
  zipCode: Yup.string()
    .required(`${localized.t("This field is required")}`)
    .matches(/^[0-9]+$/, {
      message: `${localized.t("Only numbers are allowed")}`,
      excludeEmptyString: true,
    })
    .min(6, ({ min }) => `${localized.t("This field must be at least")} ${min} ${localized.t("characters")}`),
});
