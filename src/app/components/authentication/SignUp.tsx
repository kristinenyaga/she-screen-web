"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const SignupPage = () => {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    date_of_birth: '',
    role: '',
    password: '',
    confirm_password: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const router = useRouter()



  const handleChange = (e:React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    
  }
  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault()
    const newErrors: { [key: string]: string } = {};
    if (!form.first_name.trim()) newErrors.first_name = "First name is required ";
    if (!form.last_name.trim()) newErrors.last_name = "Last name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.phone_number.trim()) newErrors.phone_number = "Phone number is required ";
    if (!form.date_of_birth.trim()) newErrors.date_of_birth = "Date of birth is required";
    if (!form.role) newErrors.role = "Role is required";

    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 8) newErrors.password = "Password must be at least 8 characters";

    if (form.password !== form.confirm_password) {
      newErrors.confirm_password = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})

    const payload = {
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      phone_number: form.phone_number,
      date_of_birth: form.date_of_birth,
      role: form.role,
      password: form.password,
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/users/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body:JSON.stringify(payload)
      })
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Failed to register user');
      }
    

      toast.success('user registered successfully', {
        duration: 4000,
        position: 'top-center',

        icon: '👏',

        iconTheme: {
          primary: '#000',
          secondary: '#fff',
        },

        removeDelay: 1000,
      });
      setForm({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        role: '',
        date_of_birth: '',
        password: '',
        confirm_password: ''
      })
      router.push('/login')
    } catch (err) {
      toast.error((err as Error).message || "Something went wrong");
    }
  }
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between font-inter">
      <header className="flex justify-between items-center px-8 py-6 ">
        <h1 className="text-2xl font-bold text-gray-800 font-poppins font-crimson-pro">
          <span className="bg-[#3BA1AF] text-white rounded-full py-2 px-1">She</span>Screen
        </h1>
        <Link href="/login">
          <button className="px-6 py-2 font-poppins text-base font-medium rounded-lg text-[#3BA1AF] border-gray-300 border border-gray-300-[#3BA1AF] hover:bg-[#3BA1AF] hover:text-white transition">
            Log In
          </button>
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl space-y-8 text-left">
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-crimson-pro font-medium text-[#3BA1AF] mb-2">
              Create an Account
            </h2>
            <p className="text-gray-800 font-inter text-sm">
              Register your facility and start managing screenings.
            </p>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-800 font-poppins">First Name</label>
              <input type="text" name="first_name" placeholder="Dr. Jane Doe" className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 placeholder:text-sm text-sm "  onChange={handleChange} />
              {errors.first_name && (
                <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 font-poppins">Last Name</label>
              <input type="text" name="last_name" placeholder="Dr. Jane Doe" className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 placeholder:text-sm text-sm"  onChange={handleChange} />
              {errors.last_name && (
                <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 font-poppins">Email Address</label>
              <input type="email" name='email' placeholder="you@clinic.org" className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 placeholder:text-sm text-sm"  onChange={handleChange} />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 font-poppins">Phone Number</label>
              <input type="tel" name="phone_number" placeholder="+254712345678" className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 placeholder:text-sm text-sm" onChange={handleChange} />
              {errors.phone_number && (
                <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 font-poppins">Position / Role</label>
              <select name='role' className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 placeholder:text-sm text-sm" onChange={handleChange} >
                <option value="">Select Role</option>
                <option value="DOCTOR">Doctor</option>
                <option value="NURSE">Nurse</option>

              </select>
              {errors.role && (
                <p className="text-red-500 text-xs mt-1">{errors.role}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 font-poppins">Date of Birth</label>
              <input
                type="date"
                name="date_of_birth"
                className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 text-sm"
                onChange={handleChange}
                value={form.date_of_birth}
              />
            </div>
            {errors.date_of_birth && (
              <p className="text-red-500 text-xs mt-1">{errors.date_of_birth}</p>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-800 font-poppins">Password</label>
              <input type="password" name='password' onChange={handleChange} placeholder="********" className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 placeholder:text-sm " minLength={8}  />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 font-poppins">Confirm Password</label>
              <input name='confirm_password' onChange={handleChange} type="password" placeholder="********" className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 placeholder:text-sm " minLength={8}  />
              {errors.confirm_password && (
                <p className="text-red-500 text-xs mt-1">{errors.confirm_password}</p>
              )}
            </div>


            <div className="md:col-span-2">
              <button type="submit" className="w-full bg-[#3BA1AF] hover:bg-[#36929e] text-white font-poppins font-medium py-3 rounded-lg transition cursor-pointer">
                Create Account
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-[#3BA1AF] hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </main>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: '',
          duration: 5000,
          removeDelay: 1000,
          style: {
            background: '#363636',
            color: '#fff',
          },

          // Default options for specific types
          success: {
            duration: 3000,
            iconTheme: {
              primary: 'green',
              secondary: 'black',
            },
          },
        }}
      />
      <footer className="text-center text-sm text-gray-500 py-6">
        &copy; {new Date().getFullYear()} SheScreen. All rights reserved.
      </footer>
    </div>
  );
};

export default SignupPage;
