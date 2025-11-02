import LoginForm from "../../components/LoginForm/LoginForm";
import bg from "../../assets/img/login-desktop.webp";
import css from "./LoginPage.module.css";

const LoginPage = () => {
  return (
    <div
      className={css.container}
      style={{
        backgroundImage: `url(${bg})`,
      }}
    >
      <LoginForm />
    </div>
  );
};

export default LoginPage;