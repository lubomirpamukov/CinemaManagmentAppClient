import React from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import styles from "./LoginPage.module.css";

type LoginFormInputs = {
  email: string;
  password: string;
};

const LoginPage: React.FC = () => {
  const { login, loading, isAuthenticated, role } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (userCredentials: LoginFormInputs) => {
    setError(null);
    try {
      await login(userCredentials.email, userCredentials.password);
    } catch (error: any) {
      setError(error.message || "Login failed");
    }
  };

  if (loading) {
    return <Spinner size="large"/>
  }

  if (isAuthenticated)
    return (
      <div className={styles.container}>
        <div className={styles.formCard + " " + styles.success}>
          Logged in as <b>{role}</b>
        </div>
      </div>
    );

  return (
    <div className={styles.container}>
      <form className={styles.formCard} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.header}>Login</div>
        {error && <div className={styles.error}>{error}</div>}
        <div>
          <label className={styles.label}>
            Email:
            <input
              className={styles.input}
              type="email"
              {...register("email", { required: "Email is required" })}
            />
          </label>
          {errors.email && (
            <span className={styles.error}>{errors.email.message}</span>
          )}
        </div>
        <div>
          <label className={styles.label}>
            Password:
            <input
              className={styles.input}
              type="password"
              {...register("password", { required: "Password is required" })}
            />
          </label>
          {errors.password && (
            <span className={styles.error}>{errors.password.message}</span>
          )}
        </div>
        <button className={styles.button} type="submit" disabled={loading}>
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
