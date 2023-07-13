import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Textarea } from "../components/utils/Input";
import Loader from "../components/utils/Loader";
import useFetch from "../hooks/useFetch";
import MainLayout from "../layouts/MainLayout";
import DropDown from "../components/DropDown";
import validateManyFields from "../validations";

const Task = () => {
  const authState = useSelector((state) => state.authReducer);
  const navigate = useNavigate();
  const [fetchData, { loading }] = useFetch();
  const { taskId } = useParams();
  const date = new Date();
  const currDate = date.toISOString().split("T")[0];

  const mode = taskId === undefined ? "add" : "update";
  const [task, setTask] = useState(null);
  const [formData, setFormData] = useState({
    issue: "",
    contact: "",
    vehicle: "",
    service: "",
    name: "",
    date: currDate,
    email: "",
    assignedTo: "",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    document.title = mode === "add" ? "Add task" : "Update Task";
  }, [mode]);

  useEffect(() => {
    if (mode === "update") {
      const config = {
        url: `/tasks/${taskId}`,
        method: "get",
        headers: { Authorization: authState.token },
      };
      fetchData(config, { showSuccessToast: false }).then((data) => {
        setTask(data.task);
        setFormData({
          issue: data.task.issue,
          contact: data.task.contact,
          vehicle: data.task.vehicle,
          service: data.task.service,
          name: data.task.name,
          date: data.task.date,
          email: data.task.email,
          assignedTo: data.task.assignedTo,
        });
      });
    }
  }, [mode, authState, taskId, fetchData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleReset = (e) => {
    e.preventDefault();
    setFormData({
      issue: task.issue,
    });
  };
  const changeAssignedTo = (e) => {
    setFormData({
      ...formData,
      assignedTo: e.name,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    const errors = validateManyFields("task", formData);
    setFormErrors({});

    if (errors.length > 0) {
      setFormErrors(
        errors.reduce((total, ob) => ({ ...total, [ob.field]: ob.err }), {})
      );
      return;
    }

    if (mode === "add") {
      const config = {
        url: "/tasks",
        method: "post",
        data: formData,
        headers: { Authorization: authState.token },
      };
      fetchData(config).then(() => {
        navigate("/");
      });
    } else {
      const config = {
        url: `/tasks/${taskId}`,
        method: "put",
        data: formData,
        headers: { Authorization: authState.token },
      };

      fetchData(config).then(() => {
        navigate("/");
      });
    }
  };

  const fieldError = (field) => (
    <p
      className={`mt-1 text-pink-600 text-sm ${
        formErrors[field] ? "block" : "hidden"
      }`}
    >
      <i className="mr-2 fa-solid fa-circle-exclamation"></i>
      {formErrors[field]}
    </p>
  );

  return (
    <>
      <MainLayout>
        <form className="m-auto my-16 max-w-[1000px]  bg-white p-8 border-2 shadow-md rounded-md">
          {loading ? (
            <Loader />
          ) : (
            <>
              <h2 className="text-center mb-4">
                {mode === "add" ? "Add New Ticket" : "Edit Ticket"}
              </h2>
              <div className="mb-4">
                <div className="flex gap-3 mb-4">
                  <h1>Name :</h1>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    class="mt-1 block w-half  bg-white border border-slate-300 rounded-sm text-sm shadow-sm placeholder-slate-200
      focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div className="flex gap-3 mb-4">
                  <h1>Vehicle RegNo :</h1>
                  <input
                    type="text"
                    name="vehicle"
                    value={formData.vehicle}
                    onChange={handleChange}
                    class="mt-1 block w-half  bg-white border border-slate-300 rounded-sm text-sm shadow-sm placeholder-slate-200
      focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div className="flex gap-3 mb-4">
                  <h1>Contact Number :</h1>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    class="mt-1 block w-half  bg-white border border-slate-300 rounded-sm text-sm shadow-sm placeholder-slate-200
      focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div className="flex gap-3 mb-4">
                  <h1>Service Fee :</h1>
                  <input
                    type="text"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    class="mt-1 block w-half  bg-white border border-slate-300 rounded-sm text-sm shadow-sm placeholder-slate-200
      focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div className="flex gap-3 mb-4">
                  <h1>Email Address :</h1>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    class="mt-1 block w-half  bg-white border border-slate-300 rounded-sm text-sm shadow-sm placeholder-slate-200
      focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div className="flex gap-3">
                  <p>Assistance time </p>
                  <input
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>

                <DropDown
                  value={formData.assignedTo}
                  changeAssignedTo={changeAssignedTo}
                />
                <div className="mt-4">
                  <label htmlFor="description" className="mt-20">
                    BreakDown Issue
                  </label>
                  <Textarea
                    type="description"
                    name="issue"
                    id="issue"
                    value={formData.issue}
                    placeholder="Write here.."
                    onChange={handleChange}
                  />
                  {fieldError("issue")}
                </div>
              </div>

              <button
                className="bg-primary text-white mt-7 px-4 py-2 font-medium hover:bg-primary-dark"
                onClick={handleSubmit}
              >
                {mode === "add" ? "Add Ticket" : "Update Ticket"}
              </button>
              <button
                className="ml-4 bg-red-500 text-white px-4 py-2 font-medium"
                onClick={() => navigate("/")}
              >
                Cancel
              </button>
              {mode === "update" && (
                <button
                  className="ml-4 bg-blue-500 text-white px-4 py-2 font-medium hover:bg-blue-600"
                  onClick={handleReset}
                >
                  Reset
                </button>
              )}
            </>
          )}
        </form>
      </MainLayout>
    </>
  );
};

export default Task;
