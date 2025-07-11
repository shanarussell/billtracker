import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import LoginScreen from "pages/login-screen";
import AddEditBill from "pages/add-edit-bill";
import RegistrationScreen from "pages/registration-screen";
import Dashboard from "pages/dashboard";
import BillManagement from "pages/bill-management";
import LandingPage from "pages/landing-page";
import FinancialSummary from "pages/financial-summary";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login-screen" element={<LoginScreen />} />
        <Route path="/add-edit-bill" element={<AddEditBill />} />
        <Route path="/registration-screen" element={<RegistrationScreen />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bill-management" element={<BillManagement />} />
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/financial-summary" element={<FinancialSummary />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;