import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { register } from "../../redux/auth/operations";
import css from "./RegistrationForm.module.css";

export const RegistrationForm = () => {
  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name too long")
      .required("Name is required"),
    email: Yup.string()
      .email("Please enter a valid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords do not match")
      .required("Please confirm your password"),
  });

  const handleSubmit = (values, { resetForm }) => {
    const { username, email, password } = values;
    
    dispatch(register({ username, email, password }))
      .unwrap()
      .then(() => {
        toast.success("Registration successful!", { 
          duration: 2500,
          style: { zIndex: 9999 }
        });
        resetForm();
      })
      .catch((error) => {
        const message = error?.message || error;

        if (message.includes("409") || message.includes("Conflict")) {
          toast.error("This email is already registered", { duration: 2000 });
        } else if (message.includes("500") || message.includes("Internal Server Error")) {
          toast.error("Server error. Please try again later.", { duration: 2500 });
        } else {
          toast.error("Registration failed. Please try again.", { duration: 2500 });
        }
      });
  };

  return (
    <div className={css.wrapper}>
      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className={css.form}>
            <h2 className={css.title}>Money Guard</h2>

            <div className={css.inputGroup}>
              <label className={css.label}>
                Name
                <Field 
                  type="text" 
                  name="username" 
                  className={css.input}
                  placeholder="Enter your name"
                />
              </label>
              <ErrorMessage name="username" component="div" className={css.error} />
            </div>

            <div className={css.inputGroup}>
              <label className={css.label}>
                E-mail
                <Field 
                  type="email" 
                  name="email" 
                  className={css.input}
                  placeholder="Enter your email"
                />
              </label>
              <ErrorMessage name="email" component="div" className={css.error} />
            </div>

            <div className={css.inputGroup}>
              <label className={css.label}>
                Password
                <Field 
                  type="password" 
                  name="password" 
                  className={css.input}
                  placeholder="Create a password"
                />
              </label>
              <ErrorMessage name="password" component="div" className={css.error} />
            </div>

            <div className={css.inputGroup}>
              <label className={css.label}>
                Confirm Password
                <Field 
                  type="password" 
                  name="confirmPassword" 
                  className={css.input}
                  placeholder="Confirm your password"
                />
              </label>
              <ErrorMessage name="confirmPassword" component="div" className={css.error} />
            </div>

            <button 
              type="submit" 
              className={css.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "CREATING ACCOUNT..." : "REGISTER"}
            </button>

            <p className={css.loginLink}>
              Already have an account? <a href="/login" className={css.link}>Log in</a>
            </p>
          </Form>
        )}
      </Formik>
    </div>
  );
};