import { useDispatch } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { NavLink } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { logIn } from "../../redux/auth/operations";
import css from "./LoginForm.module.css";

const LoginForm = () => {
  const dispatch = useDispatch();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Must be a valid email!")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .max(12, "Password cannot exceed 12 characters")
      .required("Password is required"),
  });

  const handleSubmit = (values, { resetForm }) => {
    dispatch(logIn(values))
      .unwrap()
      .then(() => {
        toast.success("Login successful!", { 
          duration: 2000,
          style: { zIndex: 9999 }
        });
      })
      .catch((error) => {
        if (error === "Request failed with status code 403") {
          toast.error("Password is incorrect", { duration: 2000 });
        } else if (error === "Request failed with status code 404") {
          toast.error(`User with email ${values.email} not found`, { duration: 2000 });
        } else {
          toast.error("Login failed. Please try again.", { duration: 2000 });
        }
      })
      .finally(() => {
        resetForm();
      });
  };

  return (
    <div className={css.loginContainer}>
      <div className={css.loginCard}>
        <div className={css.logoSection}>
          <img 
            className={css.logoImage} 
            src="../../../monerguard.svg" 
            alt="Money Guard Logo" 
          />
          <h1 className={css.appTitle}>Money Guard</h1>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className={css.loginForm}>
              <div className={css.inputGroup}>
                <div className={css.inputContainer}>
                  <MdEmail className={css.inputIcon} />
                  <Field
                    type="email"
                    name="email"
                    placeholder="E-mail"
                    className={css.formInput}
                  />
                </div>
                <ErrorMessage
                  name="email"
                  component="span"
                  className={css.errorMessage}
                />
              </div>

              <div className={css.inputGroup}>
                <div className={css.inputContainer}>
                  <RiLockPasswordFill className={css.inputIcon} />
                  <Field
                    type="password"
                    name="password"
                    placeholder="Password"
                    className={css.formInput}
                  />
                </div>
                <ErrorMessage
                  name="password"
                  component="span"
                  className={css.errorMessage}
                />
              </div>

              <button 
                type="submit" 
                className={css.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? "LOGGING IN..." : "LOG IN"}
              </button>

              <NavLink to="/register" className={css.registerLink}>
                REGISTER
              </NavLink>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginForm;
