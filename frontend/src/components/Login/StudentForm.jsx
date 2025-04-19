import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import Spinner from "../UI/Spinner";

function StudentLogin() {
  const navigate = useNavigate();
  const [spinner, setSpinner] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function changeHandler(event) {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  async function submitHandler(event) {
    event.preventDefault();

    try {
      setSpinner(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/student/login`,
        {
          email: formData.email,
          password: formData.password,
        }
      );
      if (response.data.data.user.roles !== "student") {
        toast.error("Access denied. Only students are allowed to log in.");
        setSpinner(false);
        return;
      }
      setSpinner(false);
      const { token } = response.data;
      const name = response.data.data.user.name;
      localStorage.setItem("Student jwtToken", token);
      localStorage.setItem("email", formData.email);
      localStorage.setItem("Student Name", name);
      console.log(response);
      if (response.data.data.user.admissionStatus === true) {
        navigate(`/student/dashboard`);
      } else {
        navigate("/student/notapproved");
      }
      toast.success("Logged in");
    } catch (error) {
      setSpinner(false);
      if (error.response) {
        const errorMessage = error.response.data.message;
        toast.error(errorMessage);
      } else {
        toast.error("Login failed");
      }
    }
  }

  return (
    <>
      {spinner ? (
        <Spinner />
      ) : (
        <section className="flex items-center justify-center w-full min-h-screen p-8 bg-gray-100 dark:bg-slate-900">
          <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg dark:bg-slate-800 dark:text-white dark:border-gray-200 dark:border">
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-bold">Student Login</h2>
              <p className="mt-4 text-sm dark:text-gray-300">If you are already a member, easy login</p>
              <form className="flex flex-col w-full gap-3 mt-4 dark:bg-slate-800" onSubmit={submitHandler}>
                <input
                  className="p-2 mt-3 border rounded dark:bg-slate-700"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={changeHandler}
                  placeholder="Email"
                />
                <label >Email: student@gmail.com</label>
                <input
                  className="p-2 mt-3 border rounded dark:bg-slate-700"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={changeHandler}
                  placeholder="Password"
                />
                <label >Password: pass123</label>
                <div className="flex w-full gap-3 mt-4">
                  <input
                    type="submit"
                    value="Login"
                    className="w-full p-2 text-white bg-blue-500 rounded cursor-pointer hover:bg-blue-600"
                  />
                  <Link to="/student/signup" className="w-full">
                    <button className="w-full p-2 text-white bg-blue-500 rounded cursor-pointer hover:bg-blue-600">
                      Register
                    </button>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default StudentLogin;
