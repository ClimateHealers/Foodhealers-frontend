import * as Yup from "yup"


//signup form
export const signupSchema = Yup.object().shape({
    name: Yup.string()
      .trim()
      .matches(
        /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,15}$/,
        "Name must be in correct format & max length 15"
      ),
    email: Yup.string()
      .email("Please enter valid email")
      .required("Email is required"),
    password: Yup.string()
      .trim()
      .matches(/\w*[a-z]\w*/, "Password must have a small letter")
      .matches(/\w*[A-Z]\w*/, "Password must have a capital letter")
      .matches(/\d/, "Password must have a number")
      .matches(
        /[!@#$%^&*()\-_"=+{}; :,<.>]/,
        "Password must have a special character"
      )
      .min(6, ({ min }) => `Password must be at least ${min} characters`)
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords do not match")
      .required("Confirm password is required"),
  });



//   login form
  export const loginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Please enter valid email")
      .required("Email is required"),
    password: Yup
      .string()
      .trim()
      .matches(/\w*[a-z]\w*/, "Password must have a small letter")
      .matches(/\w*[A-Z]\w*/, "Password must have a capital letter")
      .matches(/\d/, "Password must have a number")
      .matches(
        /[!@#$%^&*()\-_"=+{}; :,<.>]/,
        "Password must have a special character"
      )
      .min(6, ({ min }) => `Password must be at least ${min} characters`)
      .required("Password is required"),
  });



  //post event form

  export const postEventSchema = Yup.object().shape({
    eventName: Yup.string()
      .required("Event Name is required")
      .matches(/\w*[a-z]\w*/,"Only alphabets are allowed"),
    address: Yup
      .string()
      .required("Address is required")
      .matches(/\w*[a-z]\w*/,"Only alphabets are allowed"),
    served: Yup
      .string()
      .required("This field is required")
      .min(6, ({ min }) => `This field must be at least ${min} characters`)
      .matches(/\w*[a-z]\w*/,"Only alphabets are allowed")
  });


  //post event form

  export const AddDonations = Yup.object().shape({
    foodItem: Yup.string()
      .required("Event Name is required")
      .matches(/\w*[a-z]\w*/,"Only alphabets are allowed"),
      quantity: Yup.string()
      .required('This field is required'),
      // .matches(/^[a-zA-Z0-9]+$/, 'Only alphanumeric characters are allowed'),
      address: Yup
      .string()
      .required("Address is required")
      .matches(/\w*[a-z]\w*/,"Only alphabets are allowed"),
      phoneNumber: Yup.string()
      .required('This field is required')
      .matches(/^[0-9]+$/, { message: 'Only numbers are allowed', excludeEmptyString: true }),
      flatNo: Yup.string()
      .required('This field is required')
      .matches(/^[0-9]+$/, { message: 'Only numbers are allowed', excludeEmptyString: true }),
      zipCode: Yup.string()
      .required('This field is required')
      .matches(/^[0-9]+$/, { message: 'Only numbers are allowed', excludeEmptyString: true })
      .min(6, ({ min }) => `This field must be at least ${min} characters`)
  });
  