import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTypeFilter } from "../../redux/filters/filtersSlice";
import { selectTypeFilter } from "../../redux/filters/selectors";
import css from "./TransactionsFilter.module.css";

const FILTER_OPTIONS = [
  { key: "all", label: "All", gradient: "linear-gradient(96.76deg, #7B61FF -16.42%, #4E21A8 97.04%)" },
  { key: "income", label: "Income", gradient: "linear-gradient(96.76deg, #FFC727 -16.42%, #FFD86F 97.04%)" },
  { key: "expense", label: "Expense", gradient: "linear-gradient(96.76deg, #FF6B6B -16.42%, #FF9472 97.04%)" },
];

const TransactionsFilter = () => {
  const dispatch = useDispatch();
  const activeFilter = useSelector(selectTypeFilter);

  const handleFilterClick = (filterKey) => {
    dispatch(setTypeFilter(filterKey));
  };

  return (
    <div className={css.filterWrapper}>
      {FILTER_OPTIONS.map((filter) => (
        <button
          key={filter.key}
          className={`${css.filterButton} ${activeFilter === filter.key ? css.active : ''}`}
          onClick={() => handleFilterClick(filter.key)}
          type="button"
          aria-pressed={activeFilter === filter.key}
          style={activeFilter === filter.key ? { '--active-gradient': filter.gradient } : {}}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default TransactionsFilter;