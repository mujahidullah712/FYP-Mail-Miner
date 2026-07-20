import GoogleLogin from "./GoogleLogin";
import { Navigate } from "react-router-dom";


export default function Login({ setUser, user }) {

   if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center 
                    bg-gradient-to-br from-blue-50 to-blue-100">

      <div className="w-full max-w-md bg-white 
                      rounded-2xl shadow-xl 
                      px-10 py-12">

        {/* Logo / Title */}
        <h1 className="text-3xl font-semibold text-blue-900 text-center">
          MailMiner
        </h1>


        {/* Divider */}
        <div className="flex items-center my-8">
          <div className="flex-1 h-px bg-blue-100" />
          <span className="px-4 text-xs text-blue-400 uppercase">
            Secure Login
          </span>
          <div className="flex-1 h-px bg-blue-100" />
        </div>

        {/* Google Login */}
        <GoogleLogin setUser={setUser} />

        {/* Footer */}
        <p className="text-xs text-center text-gray-400 mt-8">
          Authorized access only • Google OAuth 2.0
        </p>
      </div>
    </div>
  );
}