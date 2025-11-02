import { Suspense, lazy, useEffect } from "react";
import styles from "./App.module.css";
import { Routes, Route, Navigate } from "react-router-dom";
import RestrictedRoute from "../RestrictedRoute";
import StatisticPage from "../../pages/StatisticPage/StatisticPage";
import PrivateRoute from "../PrivateRoute";
import Loader from "../Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { refreshUser } from "../../redux/auth/operations";
import { selectIsRefreshing } from "../../redux/auth/selectors";
import { Toaster } from "react-hot-toast";
import NotFound from "../NotFound/NotFound";
import { useMediaQuery } from "react-responsive";

const LoginPage = lazy(() => import("../../pages/LoginPage/LoginPage"));
const RegistationPage = lazy(() => import("../../pages/RegistationPage"));
const DashboardPage = lazy(() => import("../../pages/Dashboard/DashboardPage"));
const CurrencyPage = lazy(() =>
  import("../../pages/CurrencyPage/CurrencyPage")
);

function App() {
  const dispatch = useDispatch();
  const isRefreshing = useSelector(selectIsRefreshing);

  const isMobile = useMediaQuery({ maxWidth: 767 });

  useEffect(() => {
    dispatch(refreshUser());
  }, [dispatch]);

  return isRefreshing ? (
    <Loader/>
  ) : (
    <div className={styles.App}>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route
            path="/login"
            element={
              <RestrictedRoute
                redirectTo="/dashboard"
                component={<LoginPage />}
              />
            }
          />
          <Route
            path="/register"
            element={
              <RestrictedRoute
                redirectTo="/dashboard"
                component={<RegistationPage />}
              />
            }
          />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute redirectTo="/login" component={<DashboardPage />} />
            }
          />

          <Route
            path="/statistics"
            element={
              <PrivateRoute redirectTo="/login" component={<StatisticPage />} />
            }
            />
            
          <Route
            path="/currency"
            element={
              <PrivateRoute redirectTo="/login" component={isMobile ? <CurrencyPage /> : <Navigate to="/dashboard" replace />} />
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster position="top-right"  reverseOrder={false} />
    </div>
  );
}

export default App;
