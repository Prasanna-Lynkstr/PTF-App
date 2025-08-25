import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import Footer from '../../components/footer';
import Header from '../../components/header';

const HiringOrgLogin = () => {
  const [emailError, setEmailError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/user/me', { credentials: 'include' });
        if (res.ok) {
          const user = await res.json();
          if (user && user.id) {
            window.location.href = '/hiring-org/home';
          }
        }
      } catch (err) {
        // user not logged in, stay on login page
      }

      // Focus the email input after checking session
      const emailInput = document.getElementById('email');
      if (emailInput) {
        emailInput.focus();
      }
    };
    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;

    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    setEmailError('');
    setPasswordError('');

    if (!email) {
      setEmailError('Email is required');
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid');
      valid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    }

    if (!valid) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // <-- enable sending/receiving cookies
        body: JSON.stringify({ email, password }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error('Unexpected response format');
      }

      if (!response.ok) {
        const errorData = data;
        throw new Error(errorData.message || 'Login failed');
      }


      if (!data.user.isEmailVerified) {
        window.location.href = `/hiring-org/emailverify?email=${encodeURIComponent(email)}`;
      } else {
        window.location.href = `/hiring-org/home`;
      }
    } catch (error: any) {
      setLoading(false); // Move this up so UI can update before toast

      if (error instanceof Error) {
        setTimeout(() => {
          toast.error(error.message || 'Login failed', {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }, 100);
      } else {
        setTimeout(() => {
          toast.error('An unknown error occurred during login.', {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }, 100);
      }
      return;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-100">
      <Header />
      <div className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="w-full sm:max-w-md bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Recruiter Login</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="email" name="email" className="mt-1 w-full border rounded-md px-3 py-2 text-gray-800 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter your work email" required />
              {emailError && <p className="text-sm text-red-500 mt-1">{emailError}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" id="password" name="password" className="mt-1 w-full border rounded-md px-3 py-2 text-gray-800 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter your password" required />
              {passwordError && <p className="text-sm text-red-500 mt-1">{passwordError}</p>}
              <div className="text-right mt-1">
                {/* Link to forgot password page for hiring orgs */}
                <Link to="/hiring-org/forgot-password" className="text-sm text-blue-600 hover:underline">Forgot Password?</Link>
              </div>
            </div>
            {/* <div className="flex items-center mt-2">
              <input id="remember" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">Remember me</label>
            </div> */}
            <button type="submit" className="w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700 transition disabled:opacity-50" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <div className="text-center mt-4">
            <Link to="/hiring-org/signup" className="text-sm text-blue-600 hover:underline">
              Don’t have an account? Sign up
            </Link>
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer position="top-center" />
    </div>
  );
};

export default HiringOrgLogin;