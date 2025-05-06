import React, { lazy } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import NonProtectedRoutes from "./Auth/NonProtectedRoutes"
import ProtectedRoutes from "./Auth/ProtectedRoutes"
import UserStatus from './Components/UserStatus';
import Header from './Components/Header';
import Footer from './Components/Footer';
import ScrollToTop from './Components/ScrollToTop';
import Investment from './Pages/Investment';
import InvestmentDetail from './Pages/InvestmentDetail';
import PrivacyPolicy from './Pages/PrivacyPolicy';
import TermsCondition from './Pages/TermsCondition';

const Home = lazy(() => import("./Pages/Home"));
const Login = lazy(() => import("./Pages/Login"));
const SignUp = lazy(() => import("./Pages/SignUp"));
const KycVerification = lazy(() => import("./Pages/KycVerification"));
const UpdateProfile = lazy(() => import("./Pages/UpdateProfile"));
const Profile = lazy(() => import("./Pages/Profile"));
const Bot = lazy(() => import("./Pages/Bot"));
const Purchase = lazy(() => import("./Pages/Purchase"));
const Transaction = lazy(() => import("./Pages/Transactions"));
const TransactionDetail = lazy(() => import("./Pages/TransactionDetail"));
const Team = lazy(() => import("./Pages/Team"));
const Refer = lazy(() => import("./Pages/Refer"));
const Earnings = lazy(() => import('./Pages/Earnings'));
const TeamList = lazy(() => import("./Pages/TeamList"));
const LevelList = lazy(() => import("./Pages/LeveList"));
const PurchaseBotUI = lazy(() => import("./Pages/PurchaseBotUI"))

const App = () => {

  const location = useLocation();
  const showHeader = location.pathname !== "/login" && location.pathname !== "/signup";

  return (
    <div style={{ position: "relative" }}>
      <UserStatus />
      <ScrollToTop />
      <div id={`${showHeader ? "appCapsule" : ""}`} className=''
        style={{ minHeight: "100vh", position: "relative" }}>
        <Routes>
          <Route element={<NonProtectedRoutes />}>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='*' element={<Login />} />
          </Route>
          <Route path='/privacy-policy' element={
            <>
              <Header title={"Privacy Poicy"} />
              <PrivacyPolicy />
            </>
          } />
          <Route path='/terms-condition' element={
            <>
              <Header title={"Terms & Condition"} />
              <TermsCondition />
            </>
          } />

          <Route element={<ProtectedRoutes />}>
            <Route path='/' element={
              <>

                <Header showLogo={true} title={"Home"} />
                <Home />
              </>
            } />
            <Route path='/bot' element={
              <>
                <Header title={"BOT"} />
                <Bot />
              </>
            } />
            <Route path='/purchase' element={<Purchase />} />
            <Route path='/transaction' element={
              <>
                <Header title={"Transactions"} />
                <Transaction />
              </>
            } />
            <Route path='/transaction-details' element={
              <>
                <Header title={"Transaction View"} />
                <TransactionDetail />
              </>
            } />
            <Route path='/investment' element={
              <>
                <Header title={"Investment"} />
                <Investment />
              </>
            } />
            <Route path='/investment-detail' element={
              <>
                <Header title={"Investment Detail"} />
                <InvestmentDetail />
              </>
            } />
            <Route path='/team-list' element={
              <>
                <TeamList />
              </>
            } />
            <Route path='/level-list' element={
              <>
                <LevelList />
              </>
            } />
            <Route path='/purchase-bot' element={
              <>
                <Header showLogo={true} title={"Home"} />
                <PurchaseBotUI />
              </>
            } />
            <Route path='/kyc' element={
              <>
                <Header title={"KYC"} />
                <KycVerification />
              </>
            } />
            <Route path='/earnings' element={
              <>
                <Header title={"Earnings"} />
                <Earnings />
              </>
            } />

            <Route path='/refer' element={
              <>
                <Header title={"Refer & Earn"} />
                <Refer />
              </>
            } />
            <Route path='/team' element={
              <>
                <Header title={"Team"} />
                <Team />
              </>
            } />
            <Route path='/update-profile' element={
              <>
                <Header title={"Update Profile"} />
                <UpdateProfile />
              </>
            } />
            <Route path='/profile' element={
              <>
                <Header title={"Profile"} />
                <Profile />
              </>
            } />
            <Route path='*' element={<Home />} />
          </Route>
        </Routes>
      </div>
      {
        showHeader &&
        <Footer />
      }
    </div>
  )
}

export default App
