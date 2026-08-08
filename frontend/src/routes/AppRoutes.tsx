import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from '../components/common/PageTransition';

import { HomePage } from '../pages/customer/HomePage';
import { CatalogPage } from '../pages/customer/CatalogPage';
import { ProductDetailPage } from '../pages/customer/ProductDetailPage';
import { CartPage } from '../pages/customer/CartPage';
import { CheckoutPage } from '../pages/customer/CheckoutPage';
import { MyRentalsPage } from '../pages/customer/MyRentalsPage';
import { AboutPage } from '../pages/customer/AboutPage';
import { ContactPage } from '../pages/customer/ContactPage';
import { TermsPage } from '../pages/customer/TermsPage';
import { WishlistPage } from '../pages/customer/WishlistPage';
import { ProfilePage } from '../pages/customer/ProfilePage';

import { LoginPage } from '../pages/auth/LoginPage';
import { SignUpPage } from '../pages/auth/SignUpPage';
import { VendorRegisterPage } from '../pages/auth/VendorRegisterPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { PickupReturnOpsPage } from '../pages/admin/PickupReturnOpsPage';
import { AnalyticsPage } from '../pages/admin/AnalyticsPage';
import { RequireAuth, RequireAdmin } from '../components/auth/ProtectedRoutes';

export const AppRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Home Route */}
        <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
        
        {/* Products / Catalog Route */}
        <Route path="/catalog" element={<PageTransition><CatalogPage /></PageTransition>} />
        <Route path="/product/:id" element={<PageTransition><ProductDetailPage /></PageTransition>} />
        <Route path="/cart" element={<PageTransition><CartPage /></PageTransition>} />
        <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
        <Route path="/terms" element={<PageTransition><TermsPage /></PageTransition>} />
        <Route path="/wishlist" element={<PageTransition><WishlistPage /></PageTransition>} />

        {/* Supabase Auth Routes */}
        <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><SignUpPage /></PageTransition>} />
        <Route path="/vendor-register" element={<PageTransition><VendorRegisterPage /></PageTransition>} />
        <Route path="/forgot-password" element={<PageTransition><ForgotPasswordPage /></PageTransition>} />
        <Route path="/reset-password" element={<PageTransition><ResetPasswordPage /></PageTransition>} />

        {/* Protected Customer Routes */}
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <PageTransition><ProfilePage /></PageTransition>
            </RequireAuth>
          }
        />
        <Route
          path="/checkout"
          element={
            <RequireAuth>
              <PageTransition><CheckoutPage /></PageTransition>
            </RequireAuth>
          }
        />
        <Route
          path="/my-rentals"
          element={
            <RequireAuth>
              <PageTransition><MyRentalsPage /></PageTransition>
            </RequireAuth>
          }
        />

        {/* Protected Role-Based Admin & Vendor Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <RequireAdmin>
              <PageTransition><AdminDashboardPage /></PageTransition>
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/pickup-return"
          element={
            <RequireAdmin>
              <PageTransition><PickupReturnOpsPage /></PageTransition>
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <RequireAdmin>
              <PageTransition><AnalyticsPage /></PageTransition>
            </RequireAdmin>
          }
        />

        {/* Vendor and Admin share the same dashboard */}
        <Route path="/vendor/dashboard" element={<Navigate to="/admin/dashboard" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};
