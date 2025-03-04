import Form from '@/components/common/Form';
import { loginFormControlls } from '@/config';
import { loginUser } from '@/store/authSlice';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const initialstate = {
  email: '',
  password: '',
};

const Login = () => {
  const [formData, setFormData] = useState(initialstate);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();  
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = location.state?.from || (user.role === 'admin' ? '/admin/dashboard' : '/user/home');
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, location, navigate]);

  async function onSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await dispatch(loginUser(formData)).unwrap();
      setIsLoading(false);

      if (data?.success) {
        toast.success('Login Successful');
        localStorage.setItem('user', JSON.stringify(data.user));

        const redirectPath = location.state?.from || (data.user.role === 'admin' ? '/admin/dashboard' : '/user/home');
        navigate(redirectPath, { replace: true });
      } else {
        toast.error(data?.message || 'Invalid Credentials');
      }
    } catch (error) {
      setIsLoading(false);
      toast.error('An error occurred. Please try again.');
    }
  }

  return (
    <div className=" bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-7 rounded-xl">
      <div className="w-full h-full max-w-lg space-y-7">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-4 decoration-primary-300 decoration-3 underline-offset-4">
          Sign In to Explore More!
          </h1>
          <p className="text-xl text-gray-700 mb-6">
            Don't have an account?{' '}
            <Link className="text-primary-500 hover:underline font-semibold" to="/auth/register">
              Register
            </Link>
          </p>

        </div>
        <div className=" rounded-xl shadow-sm p-9 space-y-6 ">
          <Form
            formControlls={loginFormControlls}
            buttonText={isLoading ? 'Logging in...' : 'Login'}
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
          />
        </div>
        <p className="text-md text-gray-700 mt-6">
          <span>Don't remember your password?{" "}</span>
            <Link to="/auth/forgot-password" className="text-primary-500 hover:underline font-semibold">
              Reset now
            </Link>
          </p>
      </div>
    </div>
  );
};

export default Login;
