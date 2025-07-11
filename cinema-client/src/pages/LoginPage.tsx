import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks";
import Spinner from "../components/Spinner";
import styles from "./LoginPage.module.css";

type LoginFormInputs = {
  email: string;
  password: string;
};

const LoginPage: React.FC = () => {
  const { login, loading, isAuthenticated } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate()
  const onSubmit = async (userCredentials: LoginFormInputs) => {
    setError(null);
    try {
      await login(userCredentials.email, userCredentials.password);
    } catch (error: any) {
      setError(error.message || "Login failed");
    }
  };

  useEffect(() => {
    if (isAuthenticated) navigate('/bookings')
  }, [isAuthenticated])

  if (loading) {
    return <Spinner size="large"/>
  }

  
    

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
