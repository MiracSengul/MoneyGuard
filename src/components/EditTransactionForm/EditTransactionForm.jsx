import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import DatePicker from "react-datepicker";
import toast from "react-hot-toast";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./EditTransactionForm.module.css";
import { updateTransaction } from "../../redux/transactions/operations";
import { fetchCategories } from "../../redux/transactions/operations";
import { selectCategories } from "../../redux/transactions/selectors";
import "../../index.css";

const validationSchema = yup.object({
  categoryId: yup.string().when("type", {
    is: "EXPENSE",
    then: (schema) => schema.required("Category is required"),
    otherwise: (schema) => schema.optional(),
  }),
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .positive("Amount must be positive")
    .required("Amount is required"),
  date: yup.date().required("Date is required"),
  comment: yup.string().max(50, "Max 50 characters"),
  type: yup.string().oneOf(["INCOME", "EXPENSE"]).required(),
});

const EditTransactionForm = ({ transactionData, onCancel }) => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const defaultFormValues = useMemo(() => {
    if (!transactionData) return {};
    
    return {
      ...transactionData,
      date: transactionData?.transactionDate ? new Date(transactionData.transactionDate) : new Date(),
      categoryId: transactionData?.categoryId || transactionData?.category || "",
      type: transactionData?.type || "INCOME",
      amount: transactionData?.amount != null ? Math.abs(Number(transactionData.amount)) : "",
      comment: transactionData?.comment || "",
    };
  }, [transactionData]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: defaultFormValues,
  });

  const transactionType = watch("type");
  const categoryIdFromData = transactionData?.categoryId || transactionData?.category || "";
  
  const categoryName = useMemo(() => {
    return categories.find(category => category.id === categoryIdFromData)?.name || categoryIdFromData || "";
  }, [categories, categoryIdFromData]);

  const formatDateForSubmit = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const onSubmit = (formData) => {
    const submissionData = {
      transactionDate: formatDateForSubmit(formData.date),
      type: formData.type,
      amount: formData.type === "EXPENSE" ? -Math.abs(Number(formData.amount)) : Number(formData.amount),
      comment: formData.comment || "",
      categoryId: formData.categoryId || null,
    };

    dispatch(updateTransaction({ 
      id: transactionData.id, 
      updatedData: submissionData 
    }))
      .unwrap()
      .then(() => {
        toast.success("Transaction updated successfully", { 
          duration: 2000,
          style: { zIndex: 9999 } 
        });
        onCancel();
      })
      .catch(() => {
        toast.error("Failed to update transaction", { 
          duration: 2000,
          style: { zIndex: 9999 } 
        });
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
      <h2 className={styles.formTitle}>Edit Transaction</h2>

      <div className={styles.typeIndicator}>
        <span className={`${styles.typeLabel} ${transactionType === "INCOME" ? styles.incomeActive : ""}`}>
          Income
        </span>
        <span className={styles.typeSeparator}>/</span>
        <span className={`${styles.typeLabel} ${transactionType === "EXPENSE" ? styles.expenseActive : ""}`}>
          Expense
        </span>
      </div>

      {transactionType === "EXPENSE" && (
        <div className={styles.categorySection}>
          <input
            type="text"
            value={categoryName}
            readOnly
            placeholder="Category"
            className={styles.readonlyInput}
          />
          <input type="hidden" {...register("categoryId")} />
          {errors.categoryId && (
            <p className={styles.errorText}>{errors.categoryId.message}</p>
          )}
        </div>
      )}

      <div className={styles.amountDateRow}>
        <div className={styles.inputWrapper}>
          <input
            type="number"
            placeholder="0.00"
            {...register("amount")}
            className={styles.amountInput}
          />
          {errors.amount && (
            <p className={styles.errorText}>{errors.amount.message}</p>
          )}
        </div>

        <div className={styles.inputWrapper}>
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <DatePicker
                {...field}
                selected={field.value}
                onChange={field.onChange}
                dateFormat="dd.MM.yyyy"
                className={styles.dateInput}
              />
            )}
          />
          {errors.date && (
            <p className={styles.errorText}>{errors.date.message}</p>
          )}
        </div>
      </div>

      <div className={styles.inputWrapper}>
        <input
          type="text"
          placeholder="Comment"
          {...register("comment")}
          className={styles.commentInput}
        />
        {errors.comment && (
          <p className={styles.errorText}>{errors.comment.message}</p>
        )}
      </div>

      <div className={styles.actionButtons}>
        <button 
          type="submit" 
          className={`${styles.saveButton} buttonEffect`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "SAVING..." : "SAVE"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className={`${styles.cancelButton} cancelEffects`}
          disabled={isSubmitting}
        >
          CANCEL
        </button>
      </div>
    </form>
  );
};

export default EditTransactionForm;
