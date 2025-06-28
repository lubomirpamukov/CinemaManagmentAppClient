import React from "react";
import { useAuth } from "../context/AuthContext";
import { useUpdateUser } from "../hooks";
import ChangePasswordForm from "../components/user/ChangePasswordForm";
import { type TChangePassword } from "../validations";
import styles from "./ChangePasswordPage.module.css";

const ChangePasswordPage: React.FC = () => {
  const { user } = useAuth();
  const { updateUser, loading, error} = useUpdateUser();

  const onPasswordSubmit = async (newPassword: TChangePassword) => {
    if (!user?.id) return;
    await updateUser(user.id, { password: newPassword.password }, "");
  };

  if (!user) return <div className={styles.container}><p>Please log in.</p></div>;

  return (
    <div className={styles.container}>
      <ChangePasswordForm
        onSubmit={onPasswordSubmit}
        isLoading={loading}
      />
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
};

export default ChangePasswordPage;