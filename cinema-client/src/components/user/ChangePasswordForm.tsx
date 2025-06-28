import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod/src/zod.js";
import { changePasswordSchema, type TChangePassword } from "../../validations";
import Spinner from "../Spinner";
import styles from "./ChangePasswordForm.module.css";

type ChangePasswordFormProps = {
    onSubmit: (data: TChangePassword) => Promise<void>;
    isLoading: boolean;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
    onSubmit,
    isLoading
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<TChangePassword>({
        resolver: zodResolver(changePasswordSchema)
    })

    const handleFormSubmit = async (data: TChangePassword) => {
        await onSubmit(data)
        reset();
    }

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.formSection}>
            <h2 className={styles.subheading}>Change Your Password</h2>
            <div className={styles.inputGroup}>
             <label htmlFor="newPassword">New Password</label>
             <input id="newPassword" type="password" {...register("password")} />
             {errors.password && <p className={styles.errorText}>{errors.password.message}</p>}
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input id="confirmPassword" type="password" {...register("confirmPassword")} />
                {errors.confirmPassword && <p className={styles.errorText}>{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" disabled={isLoading} className={styles.button}>
                {isLoading ? <Spinner size="small"/> : "Change Password"}
            </button>
        </form>
    )
}

export default ChangePasswordForm;