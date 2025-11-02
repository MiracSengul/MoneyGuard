import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import toast from 'react-hot-toast';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './AddTransactionForm.module.css';
import {
  createTransaction,
  fetchCategories,
} from '../../redux/transactions/operations';
import { selectCategories } from '../../redux/transactions/selectors';
import '../../index.css';

const AddTransactionForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const [type, setType] = useState('INCOME');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const formatDate = (date) => {
    return date.toISOString().split('T')[0]; 
  };

  const formik = useFormik({
    initialValues: {
      categoryId: categories[0]?.id || '',
      comment: '',
      amount: '',
      transactionDate: new Date(),
    },
    validationSchema: Yup.object({
      categoryId: Yup.string().when([], {
        is: () => type === 'EXPENSE',
        then: schema => schema.required('Category is required'),
      }),
      amount: Yup.number()
        .typeError('Enter a valid number')
        .positive('Amount must be positive')
        .required('Amount is required'),
      comment: Yup.string().max(50, 'Max 50 characters'),
      transactionDate: Yup.date()
        .required('Date is required')
        .typeError('Date is required'),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      
      try {
        const transactionData = {
          transactionDate: formatDate(values.transactionDate),
          type,
          categoryId: type === 'INCOME' 
            ? '063f1132-ba5d-42b4-951d-44011ca46262' 
            : values.categoryId,
          amount: type === 'EXPENSE' ? -values.amount : values.amount,
          comment: values.comment,
        };

        await dispatch(createTransaction(transactionData)).unwrap();
        
        toast.success('Transaction added successfully', { 
          duration: 2000,
          style: { zIndex: 9999 } 
        });
        onClose();
      } catch (error) {
        toast.error('Failed to add transaction. Please try again.', { 
          duration: 2000,
          style: { zIndex: 9999 } 
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  const toggleType = () => {
    const newType = type === 'INCOME' ? 'EXPENSE' : 'INCOME';
    setType(newType);
    
    if (newType === 'EXPENSE' && categories.length > 0) {
      formik.setFieldValue('categoryId', categories[0].id);
    }
  };

  const handleDateChange = (date) => {
    formik.setFieldValue('transactionDate', date);
  };

  return (
    <form onSubmit={formik.handleSubmit} className={styles.formContainer}>
      <h2 className={styles.title}>Add transaction</h2>

      <div className={styles.toggleContainer}>
        <span className={`${styles.toggleLabel} ${type === 'INCOME' ? styles.active : ''}`}>
          Income
        </span>

        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={type === 'EXPENSE'}
            onChange={toggleType}
            disabled={isLoading}
          />
          <span className={styles.slider}></span>
        </label>

        <span className={`${styles.toggleLabel} ${type === 'EXPENSE' ? styles.active : ''}`}>
          Expense
        </span>
      </div>

      {type === 'EXPENSE' && (
        <div>
          <select
            name="categoryId"
            value={formik.values.categoryId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={styles.categorySelect}
            disabled={isLoading}
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {formik.touched.categoryId && formik.errors.categoryId && (
            <div className={styles.error}>{formik.errors.categoryId}</div>
          )}
        </div>
      )}

      <div className={styles.inputRow}>
        <input
          type="number"
          name="amount"
          placeholder="0.00"
          value={formik.values.amount}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={styles.inputField}
          step="0.01"
          min="0"
          disabled={isLoading}
        />
        <DatePicker
          selected={formik.values.transactionDate}
          onChange={handleDateChange}
          dateFormat="dd.MM.yyyy"
          className={styles.datePicker}
          disabled={isLoading}
        />
      </div>
      
      {formik.touched.amount && formik.errors.amount && (
        <div className={styles.error}>{formik.errors.amount}</div>
      )}
      {formik.touched.transactionDate && formik.errors.transactionDate && (
        <div className={styles.error}>{formik.errors.transactionDate}</div>
      )}

      <input
        type="text"
        name="comment"
        placeholder="Comment"
        value={formik.values.comment}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className={styles.comment}
        maxLength={50}
        disabled={isLoading}
      />
      {formik.touched.comment && formik.errors.comment && (
        <div className={styles.error}>{formik.errors.comment}</div>
      )}

      <div className={styles.buttonGroup}>
        <button 
          type="submit" 
          className={`${styles.addButton} buttonEffect`}
          disabled={isLoading}
        >
          {isLoading ? 'Adding...' : 'ADD'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className={`${styles.cancelButton} buttonEffect`}
          disabled={isLoading}
        >
          CANCEL
        </button>
      </div>
    </form>
  );
};

export default AddTransactionForm;
