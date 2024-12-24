import { useState } from "react";
import SwitcherOne from "../Switchers/SwitcherOne";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { planOptions, PlanOptions } from "../../pages/Users/CreateUserForm";
import SelectGroupOne from "../Forms/SelectGroup/SelectGroupOne";

interface TableProps {
  title: string;
  columns: Array<string>;
  data: any;
}

const TableOne = ({ title, columns, data }: TableProps) => {
  const [userStatuses, setUserStatuses] = useState(
    data?.users?.reduce((acc: any, user: any) => {
      acc[user.email] = user.activeStatus;
      return acc;
    }, {})
  );

  const [firstSubscribed, setFirstSubscribed] = useState(true)
  const navigate = useNavigate();

  const handleToggleStatus = async (email: string) => {
    const currentStatus = userStatuses[email];
    const updatedStatus = !currentStatus;
    // Update API
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3012/api/v2/admin/user/updateStatus', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          status: updatedStatus
        })
      });
      const data = await response.json();
      toast(`${data?.message}`)
      setUserStatuses((prevStatuses: any) => ({
        ...prevStatuses,
        [email]: updatedStatus,
      }));
    } catch (error) {
      console.error("Failed to update user status:", error);
    }
  };

  const handlePayment = async (email: string, stripeId: string, plan: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3012/api/v2/admin/payment/subscription', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          stripeId: stripeId,
          plan: plan,
          isDashboard: true
        })
      });
      const data = await response.json();
      if (response?.status === 401) {
        toast(`${data?.message}`)
        navigate('/auth/signin')
      }
      if (response.status === 200 && data.success === true) {
        toast(`${data?.message}`);
        setFirstSubscribed(true);
        window.location.replace(data?.url);
      }

      return;
    } catch (error) {
      console.error("Failed to update user status:", error);
    }
  }

  if (!data || data.length === 0) {
    return <p>No data to display.</p>;
  }
  console.log('TABLE DATA', data.users[0].activeStatus, data.lastDoc)
  // data.users[0].activeStatus = true;
  // console.log('TABLE DATA AFTER', data.users[0].activeStatus)

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        {title}
      </h4>

      <div className="flex flex-col">
        <div className="grid grid-cols-5 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
          {columns?.map((colName) => (
            <div className="p-2 xl:p-3">
              <h5 className="text-sm font-medium uppercase xsm:text-base">{colName}</h5>
            </div>
          ))}
        </div>

        {data?.users.map((user: any, key: any, index: any) => (
          <div
            className={`grid grid-cols-5 sm:grid-cols-5 ${user.email === data.users[data.users.length - 1]?.email ? '' : 'border-b border-stroke dark:border-strokedark'}`}
            key={user.email}
          >
            {/* <div className="p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{user.name}</p>
            </div> */}
            <div className="p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{user.email}</p>
            </div>
            <div className="p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{user.plan}</p>
            </div>
            <div className="p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{user.status}</p>
            </div>
            <div className="p-2.5 xl:p-5">
              <SwitcherOne
                userCurrentActiveStatus={
                  typeof userStatuses[user.email] === "boolean"
                    ? userStatuses[user.email]
                    : "-"
                }
                onToggle={() => handleToggleStatus(user.email)}
                id={`switcher-${user.email}`} // Use a unique id
              />
            </div>
            <div className="p-2.5 xl:p-5">

              {
                firstSubscribed && (
                  <>
                    <div>
                      <div className="relative">
                        <SelectGroupOne
                          title="Upgrade Plan"
                          fieldName="plan"
                          options={Object.fromEntries(
                            Object.entries(planOptions).filter(([key, value]) => value !== user.plan)
                          )}
                          handleChange={async (e) => {
                            await handlePayment(user.email, user.stripeId, e.target.value);
                          }} />
                      </div>
                    </div>
                  </>

                )
              }
              {
                !firstSubscribed && (
                  <button
                    className="bg-primary text-white px-2 py-2 rounded hover:bg-primary-dark transition"
                    onClick={() => handlePayment(user.email, user.stripeId, user.plan)}
                  >
                    Subscribe
                  </button>
                )
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableOne