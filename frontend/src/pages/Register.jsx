import Form from '@/components/common/Form'
import { registerFormControlls } from '@/config'
import { registerUser } from '@/store/authSlice'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

const initialstate = {
  username: '',
  email: '',
  password: ''
}

const Register = () => {

  const [formData, setFormData] = useState(initialstate)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  async function onSubmit(e) {
    e.preventDefault();

    try {
      const data = await dispatch(registerUser(formData));
      if (data?.payload?.success) {
        toast.success('Account created successfully!');
        toast.custom(
          <div className="px-4 py-2 bg-green-500 text-white rounded-xl text-sm text-center font-bold">
            Redirecting to login...
          </div>,
          { duration: 3000 }
        );
        navigate('/auth/login');
      } else {
        toast.error('Registration failed! Please try again.');
      }
    } catch (error) {
      toast.error('An unexpected error occurred.');
      console.error(error);
    }
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-7 rounded-xl">
      <div className="w-full h-full max-w-lg space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-4 decoration-primary-300 decoration-3 underline-offset-4">
            Create Your Account
          </h1>
          <p className="text-xl text-gray-700 mb-6">
            Already have an account?{' '}
            <Link className="text-primary-500 hover:underline font-semibold" to="/auth/login">
              Login
            </Link>
          </p>
        </div>
        <div className="rounded-xl shadow-sm p-8 space-y-6">
          <Form
            formControlls={registerFormControlls}
            buttonText={'Sign Up'}
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </div>
  )
}

export default Register