import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod/src/zod.js";
import { profileDetailsSchema, type TProfileDetails } from "../../validations";
import Spinner from "../Spinner";
import styles from "./UpdateDetailsForm.module.css";

type UpdateDetailsFormProps = {
  initialData: TProfileDetails;
  onSubmit: (data: TProfileDetails) => void;
  isLoading: boolean;
};

const UpdateDetailsForm: React.FC<UpdateDetailsFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TProfileDetails>({
    resolver: zodResolver(profileDetailsSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formSection}>
      <h2 className={styles.subheading}>Update Your Details</h2>

      <div className={styles.inputGroup}>
        <label htmlFor="name"> Name</label>
        <input id="name" type="text" {...register("name")} />
        {errors.name && (
          <p className={styles.errorText}>{errors.name.message}</p>
        )}
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="email"> Email</label>
        <input id="email" type="email" {...register("email")} />
        {errors.email && (
          <p className={styles.errorText}>{errors.email.message}</p>
        )}
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="contact"> Contact</label>
        <input id="contact" type="number" {...register("contact")} />
        {errors.contact && (
          <p className={styles.errorText}>{errors.contact.message}</p>
        )}
      </div>

      <h3 className={styles.fieldGroupTitle}>Address</h3>
      <div className={styles.inputGroup}>
        <label htmlFor="line1"> Line1</label>
        <input id="line1" type="text" {...register("address.line1")} />
        {errors.address?.line1 && (
          <p className={styles.errorText}>{errors.address.line1.message}</p>
        )}
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="city"> City</label>
        <input id="city" type="text" {...register("address.city")} />
        {errors.address?.city && (
          <p className={styles.errorText}>{errors.address.city.message}</p>
        )}
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="state">State</label>
        <input id="state" type="text" {...register("address.state")} />
        {errors.address?.state && (
          <p className={styles.errorText}>{errors.address.state.message}</p>
        )}
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="zipcode">Zip Code</label>
        <input id="zipcode" type="text" {...register("address.zipcode")} />
        {errors.address?.zipcode && (
          <p className={styles.errorText}>{errors.address.zipcode.message}</p>
        )}
      </div>
      <button type="submit" disabled={isLoading} className={styles.button}>
        {isLoading ? <Spinner size="small" /> : "Save Details"}
      </button>
    </form>
  );
};

export default UpdateDetailsForm;
