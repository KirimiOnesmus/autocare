import React from "react";
import BusinessOverview from "../../pages/business/BusinessOverview";
import { AdminOverview } from "../../pages/Admin";

const Overview = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const role = user?.role || "";

  return (
    <div>
      {role === "super_admin" ? <AdminOverview/> : <BusinessOverview />}
  
    </div>
  );
};

export default Overview;
