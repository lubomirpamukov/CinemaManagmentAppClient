import React from "react";
import { useAuth } from "../context/AuthContext";
import { useUpdateUser } from "../hooks";
import UpdateDetailsForm from "../components/user/UpdateDetailsForm";
import { type TProfileDetails } from "../validations";
import styles from "./ProfilePage.module.css";

const UpdateDetailsPage: React.FC = () => {
  const { user, setUser } = useAuth();
  const { updateUser, loading, error } = useUpdateUser();

  const onDetailsSubmit = async (userDetails: TProfileDetails) => {
    if (!user) return;
    const updatedFields = await updateUser(user.id, userDetails, "");
    if (updatedFields) {
      setUser(prev => prev ? { ...prev, ...updatedFields } : null);
    }
  };

  if (!user) return null;

  return (
    <>
      <UpdateDetailsForm
        initialData={user}
        onSubmit={onDetailsSubmit}
        isLoading={loading}
      />
      {error && <p className={styles.errorText}>{error}</p>}
    </>
  );
};

export default UpdateDetailsPage;