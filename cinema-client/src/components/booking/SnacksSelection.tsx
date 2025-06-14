import React from "react";
import type { TSnack } from "../../validations"; // Adjust path
import type { SelectedSnackInfo } from "./SelectCinemaAndSnacksStep"; // Or move this type to a shared location
import styles from "./SnacksSelection.module.css"; // Can share styles or have its own

type SnacksSelectionProps = {
  availableSnacks: TSnack[];
  selectedSnacks: Record<string, SelectedSnackInfo>;
  onSnackQuantityChange: (snack: TSnack, newQuantity: number) => void;
  totalSnackCost: number;
};

const SnacksSelection: React.FC<SnacksSelectionProps> = ({
  availableSnacks,
  selectedSnacks,
  onSnackQuantityChange,
  totalSnackCost,
}) => {
  if (!availableSnacks || availableSnacks.length === 0) {
    return (
      <div className={styles.infoMessage}>
        No snacks available at this cinema.
      </div>
    );
  }

  return (
    <div className={styles.snacksSection}>
      <h3 className={styles.mainLabel}>Choose Your Snacks</h3>
      <div className={styles.snacksGrid}>
        {availableSnacks.map((snack) => (
          <div key={snack._id} className={styles.snackItem}>
            <div className={styles.snackInfo}>
              <h4 className={styles.snackName}>{snack.name}</h4>
              {snack.description && (
                <p className={styles.snackDescription}>{snack.description}</p>
              )}
              <p className={styles.snackPrice}>${snack.price.toFixed(2)}</p>
            </div>
            <div className={styles.snackQuantityControl}>
              <button
                type="button"
                className={styles.quantityButton}
                onClick={() =>
                  onSnackQuantityChange(
                    snack,
                    (selectedSnacks[snack._id!]?.quantity || 0) - 1
                  )
                }
                aria-label={`Decrease quantity of ${snack.name}`}
              >
                -
              </button>
              <input
                type="number"
                className={styles.quantityInput}
                value={selectedSnacks[snack._id!]?.quantity || 0}
                onChange={(e) =>
                  onSnackQuantityChange(
                    snack,
                    parseInt(e.target.value, 10) || 0
                  )
                }
                min="0"
                aria-label={`Quantity of ${snack.name}`}
              />
              <button
                type="button"
                className={styles.quantityButton}
                onClick={() =>
                  onSnackQuantityChange(
                    snack,
                    (selectedSnacks[snack._id!]?.quantity || 0) + 1
                  )
                }
                aria-label={`Increase quantity of ${snack.name}`}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
      {Object.keys(selectedSnacks).length > 0 && (
        <div className={styles.totalSnacksCost}>
          <h4>Snacks Total: ${totalSnackCost.toFixed(2)}</h4>
        </div>
      )}
    </div>
  );
};

export default SnacksSelection;
