import { Navigate } from "react-router-dom";

function FlashError({ status, message }) {
  // 401 - access not authorized
  if (status === 402) {
    localStorage.setItem("isLoggedIn", false);
  }

  return (
    <>
      <h4>
        {status} {message}
      </h4>
      {status === 402 && (
        <a className="font-bold text-sky-600 underline " href="/">
          Go to Login
        </a>
      )}
    </>
  );
}
export default FlashError;
