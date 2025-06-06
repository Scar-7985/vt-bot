import React, { lazy } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import NonProtectedRoutes from "./Auth/NonProtectedRoutes"
import ProtectedRoutes from "./Auth/ProtectedRoutes"
import UserStatus from './Components/UserStatus';
import Header from './Components/Header';
import Footer from './Components/Footer';
import ScrollToTop from './Components/ScrollToTop';

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
const Community = lazy(() => import("./Pages/Community"));
const Refer = lazy(() => import("./Pages/Refer"));
const Pocket = lazy(() => import('./Pages/Pocket'));
const CommunityList = lazy(() => import("./Pages/CommunityList"));
const LevelList = lazy(() => import("./Pages/LeveList"));
const PurchaseBotUI = lazy(() => import("./Pages/PurchaseBotUI"))
const PrivacyPolicy = lazy(() => import("./Pages/PrivacyPolicy"))
const TermsCondition = lazy(() => import('./Pages/TermsCondition'));
const Investment = lazy(() => import('./Pages/Investment'));
const Notification = lazy(() => import('./Pages/Notification'));
const NotificationDetail = lazy(() => import('./Pages/NotificationDetail'));
const Support = lazy(() => import("./Pages/Support"));
const Trading = lazy(() => import("./Pages/Trading"));
const AutoLogin = lazy(() => import("./Pages/AutoLogin"))

const App = () => {

  const location = useLocation();
  const showHeader = location.pathname !== "/login" && location.pathname !== "/signup" && location.pathname !== "/autolog";

  return (
    <div style={{ backgroundColor: "#EDEDF5" }}>
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

          <Route path='/autolog' element={<AutoLogin />} />

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
                <Header title={"Transaction Info"} />
                <TransactionDetail />
              </>
            } />
            <Route path='/notification' element={
              <>
                <Header title={"Notifications"} />
                <Notification />
              </>
            } />
            <Route path='/notification-view' element={
              <>
                <Header title={"Notification Detail"} />
                <NotificationDetail />
              </>
            } />
            <Route path='/investment' element={
              <>
                <Header title={"Investment"} />
                <Investment />
              </>
            } />
            <Route path='/community-list' element={
              <>
                <CommunityList />
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
            <Route path='/pocket' element={
              <>
                <Header title={"Pocket"} />
                <Pocket />
              </>
            } />
            <Route path='/refer' element={
              <>
                <Header title={"Refer & Earn"} />
                <Refer />
              </>
            } />
            <Route path='/community' element={
              <>
                <Header title={"Community"} />
                <Community />
              </>
            } />
            <Route path='/update-profile' element={
              <>
                <Header title={"Update Profile"} />
                <UpdateProfile />
              </>
            } />
            <Route path='/trading' element={
              <>
                <Header title={"Trading"} />
                <Trading />
              </>
            } />
            <Route path='/support' element={
              <>
                <Header title={"Support"} />
                <Support />
              </>
            } />
            <Route path='/profile' element={
              <>
                <Header title={"Account"} />
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
