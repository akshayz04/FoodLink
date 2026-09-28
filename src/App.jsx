import { useEffect, useRef, useState } from "react";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

import { auth } from "./firebase/config";
import heroImage from "./assets/hero.png";
import "./App.css";


/* =========================================================
   FOODLINK LOGO
   Two leaves + vein + fork
   ========================================================= */

function FoodLinkLogo() {
  return (
    <svg
      className="foodlink-logo"
      viewBox="0 0 104 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="FoodLink"
      role="img"
    >
      {/* LEFT LEAF */}
      <path
        d="M48 90 C14 84 5 50 14 20 C42 22 58 46 48 90 Z"
        fill="#239653"
      />

      {/* LEFT LEAF VEIN */}
      <path
        d="M28 76 C26 58 28 44 34 32"
        stroke="#ffffff"
        strokeWidth="3.2"
        fill="none"
        strokeLinecap="round"
      />

      {/* RIGHT LEAF */}
      <path
        d="M53 90 C50 44 66 20 92 12 C102 48 88 84 53 90 Z"
        fill="#239653"
      />

      {/* FORK INSIDE RIGHT LEAF */}
      <g
        transform="rotate(12 76 58)"
        stroke="#ffffff"
        strokeWidth="3.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M67 36 V48 C67 57 85 57 85 48 V36" />
        <path d="M76 36 V78" />
      </g>
    </svg>
  );
}


/* =========================================================
   APP
   ========================================================= */

function App() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");

  const recaptchaVerifier = useRef(null);


  /* =======================================================
     CLEANUP RECAPTCHA
     ======================================================= */

  useEffect(() => {
    return () => {
      if (recaptchaVerifier.current) {
        recaptchaVerifier.current.clear();
        recaptchaVerifier.current = null;
      }
    };
  }, []);


  /* =======================================================
     RECAPTCHA
     ======================================================= */

  const setupRecaptcha = () => {
    if (!recaptchaVerifier.current) {
      recaptchaVerifier.current = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => {},
        }
      );
    }

    return recaptchaVerifier.current;
  };


  /* =======================================================
     SEND OTP
     ======================================================= */

  const handleSendOTP = async (e) => {
    e.preventDefault();

    setError("");

    const cleanPhone = phone.replace(/\D/g, "");

    if (cleanPhone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      setLoading(true);

      const appVerifier = setupRecaptcha();

      const result = await signInWithPhoneNumber(
        auth,
        `+91${cleanPhone}`,
        appVerifier
      );

      setConfirmationResult(result);
      setOtp("");
    } catch (err) {
      console.error(err);

      setError(
        "Unable to send OTP. Please check the number and Firebase configuration."
      );

      if (recaptchaVerifier.current) {
        recaptchaVerifier.current.clear();
        recaptchaVerifier.current = null;
      }
    } finally {
      setLoading(false);
    }
  };


  /* =======================================================
     VERIFY OTP
     ======================================================= */

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    setError("");

    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    try {
      setVerifying(true);

      await confirmationResult.confirm(otp);

      console.log("FoodLink login successful");
    } catch (err) {
      console.error(err);

      setError(
        "Invalid OTP. Please check the code and try again."
      );
    } finally {
      setVerifying(false);
    }
  };


  /* =======================================================
     BACK
     ======================================================= */

  const handleBack = () => {
    setConfirmationResult(null);
    setOtp("");
    setError("");
  };


  /* =======================================================
     UI
     ======================================================= */

  return (
    <main className="login-page">

      {/* BACKGROUND */}
      <div className="hero-image">
        <img
          src={heroImage}
          alt="FoodLink food sharing"
        />
      </div>


      {/* LOGIN AREA */}
      <section className="login-panel">

        <div className="login-card">

          {/* BRAND */}
          <div className="brand">

            <FoodLinkLogo />

            <div className="brand-text">
              <h2>FoodLink</h2>

              <p>
                From Surplus to Someone.
              </p>
            </div>

          </div>


          {!confirmationResult ? (

            <>
              {/* WELCOME */}
              <div className="login-content">

                <h1>
                  <span>Welcome to</span>

                  <strong>
                    FoodLink
                  </strong>
                </h1>

                <p>
                  Connect surplus food with people who need it.
                </p>

              </div>


              {/* PHONE LOGIN */}
              <form
                className="phone-section"
                onSubmit={handleSendOTP}
              >

                <label>
                  Phone Number
                </label>


                <div className="phone-input">

                  <div className="country-code">
                    +91
                  </div>

                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength="10"
                    placeholder="Enter 10-digit mobile number"
                    value={phone}
                    onChange={(e) => {

                      const value =
                        e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10);

                      setPhone(value);
                      setError("");
                    }}
                    disabled={loading}
                  />

                </div>


                {/* SEND OTP */}
                <button
                  type="submit"
                  className="send-otp-button"
                  disabled={loading}
                >

                  <span>
                    {loading
                      ? "Sending OTP..."
                      : "Send OTP"}
                  </span>

                  {!loading && (
                    <span className="button-arrow">
                      →
                    </span>
                  )}

                </button>


                {/* RECAPTCHA */}
                <div id="recaptcha-container" />


                {/* ERROR */}
                {error && (
                  <div className="error-message">
                    {error}
                  </div>
                )}

              </form>


              {/* OR */}
              <div className="or-divider">

                <span></span>

                <p>or</p>

                <span></span>

              </div>


              {/* EMAIL */}
              <button
                type="button"
                className="email-button"
              >

                <span className="email-icon">
                  ✉
                </span>

                <span>
                  Continue with Email
                </span>

              </button>


              {/* TERMS */}
              <p className="terms">

                By continuing, you agree to FoodLink's{" "}

                <a href="#terms">
                  Terms of Service
                </a>{" "}

                and{" "}

                <a href="#privacy">
                  Privacy Policy
                </a>.

              </p>

            </>

          ) : (

            /* =================================================
               OTP SCREEN
               ================================================= */

            <div className="otp-section">

              <FoodLinkLogo />

              <h2>
                Verify your number
              </h2>

              <p>
                Enter the 6-digit OTP sent to
                <br />
                <strong>
                  +91 {phone}
                </strong>
              </p>


              <form onSubmit={handleVerifyOTP}>

                <input
                  className="otp-input"
                  type="text"
                  inputMode="numeric"
                  maxLength="6"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => {

                    const value =
                      e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6);

                    setOtp(value);
                    setError("");
                  }}
                />


                <button
                  type="submit"
                  className="verify-button"
                  disabled={verifying}
                >

                  {verifying
                    ? "Verifying..."
                    : "Verify OTP"}

                </button>

              </form>


              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}


              <button
                type="button"
                className="back-button"
                onClick={handleBack}
              >
                ← Change phone number
              </button>

            </div>

          )}

        </div>

      </section>

    </main>
  );
}

export default App;