import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface NewErrors {
  email?: string
  name?: string
  password?: string
  confirmPassword?: string
}

interface Errors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const SignIn: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState<Errors>({});

  const navigate = useNavigate()

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors: NewErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }
    if (!formData.password) newErrors.password = "Password is required.";
    return newErrors;
  };

  const handleSubmit = async (e: any) => {
    console.log('Trigger')
    e.preventDefault();
    const validationErrors = validate();
    console.log('Trigger', Object.keys(validationErrors).length === 0)
    if (Object.keys(validationErrors).length === 0) {
      console.log("Form submitted successfully", formData);
      // Proceed with form submission (e.g., API call)
      try {
        const response = await fetch('http://localhost:3012/api/v2/admin/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Logged in successfully', data);
          // Handle success (e.g., navigate to another page or display a success message)
          toast.success('Logged in successfully')
          localStorage.setItem('token', data?.accessToken)
          localStorage.setItem('adminName', data?.userData?.name)
          console.log(localStorage.getItem('token'))
          navigate('/users'); //navigate to users page
        } else {
          const errorData = await response.json();
          console.error('Form submission failed', errorData?.message);
          toast.error(`${errorData?.message}`)
          // Handle errors returned by the server
        }
      } catch (error) {
        console.error('An error occurred while submitting the form', error);
        // Handle network or unexpected errors
        toast.error('Something went wrong')
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    // <DefaultLayout>
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="w-full max-w-md rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="p-6 sm:p-10">
            <h2 className="mb-8 text-center text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
              Sign In
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full cursor-pointer rounded-lg border border-primary bg-primary py-3 text-white transition hover:bg-opacity-90"
                >
                  Sign In
                </button>
              </div>

              <div className="mt-4 text-center">
                <p>
                  Dont have an account?{' '}
                  <Link to="/auth/signup" className="text-primary">
                    Sign up
                  </Link>
                </p>
                <br/>
                <p>
                  Forgot Password?{' '}
                  <Link to="/auth/forgot-password" className="text-primary">
                    Forgot Password
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>

    // </DefaultLayout>
  );
};

export default SignIn;
