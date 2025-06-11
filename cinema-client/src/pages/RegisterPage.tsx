import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services";
import { z } from "zod";
import { userSchema, UserValidation } from "../validations";
import styles from "./RegisterPage.module.css";
import { zodResolver } from "@hookform/resolvers/zod/src/zod.js";

const registerUserSchema = userSchema
  .extend({
    confirmPassword: z
      .string()
      .min(8, UserValidation.password)
      .max(100, UserValidation.password),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password must match",
    path: ["confirmPassword"],
  });

type TRegisterUserSchema = z.infer<typeof registerUserSchema>;

const RegisterPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TRegisterUserSchema>({
    resolver: zodResolver(registerUserSchema),
  });
  const [registrationError, setRegistrationError] = useState<string | null>(
    null
  );
  const navigate = useNavigate();

  const onSubmit = async (userData: TRegisterUserSchema) => {
    setRegistrationError(null);

    try {
      await registerUser({
        email: userData.email,
        password: userData.password,
      });
      navigate("/login");
    } catch (error: any) {
      setRegistrationError(
        error.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.formCard} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.header}>Create Account</div>
        {registrationError && (
          <div className={styles.error}>{registrationError}</div>
        )}

        <div>
          <label htmlFor="email" className={styles.label}>
            Email:
            <input
              id="email"
              type="email"
              className={styles.input}
              {...register("email")}
            />
          </label>
          {errors.email && (
            <span className={styles.error}>{errors.email.message}</span>
          )}
        </div>

        <div>
          <label htmlFor="password" className={styles.label}>
            Password:
            <input
              id="password"
              type="password"
              className={styles.input}
              {...register("password")}
            />
          </label>
          {errors.password && (
            <span className={styles.error}>{errors.password.message}</span>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className={styles.label}>
            Confirm Password:
            <input
              id="confirmPassword"
              type="password"
              className={styles.input}
              {...register("confirmPassword")}
            />
          </label>
          {errors.confirmPassword && (
            <span className={styles.error}>
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        <button type="submit" className={styles.button} disabled={isSubmitting}>
          {isSubmitting ? "Registering..." : "Register"}
        </button>

        <div className={styles.loginLink}>
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
