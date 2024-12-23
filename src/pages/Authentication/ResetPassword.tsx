import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface NewErrors {
    newPassword?: string
    confirmPassword?: string
}

interface Errors {
    newPassword?: string;
    confirmPassword?: string;
}

const ResetPassword = () => {
    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState<Errors>({});

    const navigate = useNavigate();

    // const params= useParams();
    // console.log('TOKEN', params)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    console.log("Token from URL:", token);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validate = () => {
        const newErrors: NewErrors = {};
        if (!formData.newPassword) newErrors.newPassword = "Password is required.";
        if (formData.newPassword.length < 6) {
            newErrors.newPassword = "Password must be at least 6 characters.";
        }
        if (formData.confirmPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
        }
        return newErrors;
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const validationErrors = validate();
        console.log('Trigger', Object.keys(validationErrors).length === 0)
        if (Object.keys(validationErrors).length === 0) {
            // Proceed with form submission (e.g., API call)
            try {
                const response = await fetch(`http://localhost:3012/api/v2/admin/auth/reset-password?token=${token}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        newPassword: formData.newPassword
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Reset password successful', data);
                    toast.success(data?.message)
                    // navigate('/auth/signin');
                } else {
                    const errorData = await response.json();
                    console.error('Form submission failed', errorData?.message);
                    toast.error(`${errorData?.message}`)
                }
            } catch (error) {
                console.error('An error occurred while submitting the form', error);
                toast.error('Something went wrong')
            }
        } else {
            setErrors(validationErrors);
        }
    };

    return (
        <>
            <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
                <div className="w-full max-w-md rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="p-6 sm:p-10">
                        <h2 className="mb-8 text-center text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                            Password Reset
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="mb-2.5 block font-medium text-black dark:text-white">
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                    {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="mb-2.5 block font-medium text-black dark:text-white">
                                    Re-type Password
                                </label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Re-enter your password"
                                        className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary py-3 text-white transition hover:bg-opacity-90"
                                >
                                    Reset Password
                                </button>
                            </div>

                            <div className="mt-4 text-center">
                                <p>
                                    Have an account?{' '}
                                    <Link to="/auth/signin" className="text-primary">
                                        Sign in
                                    </Link>
                                </p>
                                <br/>
                                <p>
                                    <Link to="/auth/forgot-password" className="text-primary">
                                        Generate Password Reset Link
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ResetPassword
