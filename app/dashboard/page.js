"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SideNavbar from "@/app/component/SideNavbar";
import WorkOderModal from "@/app/component/WorkOrderModal"; //

const DashboardPage = () => {
  const { data: session, status } = useSession(); // Get session status and session data
  const router = useRouter();
  const [workorders, setWorkOrder] = useState([]);
  const [workOrderHistory, setWorkOrderHistory] = useState([]);
  const [totalWorkOrders, setTotalWorkOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);

  const fetchWorkOrders = async (page = 1) => {
    try {
      const res = await fetch(`/api/workorders?page=${page}&limit=12`, {
        method: "GET",
        credentials: "include", // Ensure cookies are sent with the request
      });
      const data = await res.json();
      if (res.ok) {
        setWorkOrder(data.wo);
        setTotalWorkOrders(data.totalWorkOrders);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
      } else {
        console.log("Failed to load work orders", data.error);
      }
    } catch (error) {
      console.log("Error fetching work orders", error);
    }
  };

  // If the session is loading or the user is not authenticated, redirect to login page
  useEffect(() => {
    if (status === "loading") {
      return; // Wait for session loading to complete
    }
    if (!session) {
      // Redirect user to login page if not authenticated
      router.push("/auth/login");
      return;
    }

    // Fetch the first page of work orders when the session is ready
    fetchWorkOrders(currentPage);
  }, [status, session, router, currentPage]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return; // Prevent invalid page numbers
    setCurrentPage(page);
    fetchWorkOrders(page);
  };

  const handleViewClick = async (woNumber) => {
    try {
      const res = await fetch(`/api/workOrderHistory?WO_NUMBER=${woNumber}`);
      const data = await res.json();
      if (res.ok) {
        setSelectedWorkOrder(data);
        setIsModalOpen(true);
        setWorkOrderHistory(data.wo);
      } else {
        console.error("Failed to load work order details", data.error);
      }
    } catch (error) {
      console.error("Error fetching work order details", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedWorkOrder(null);
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null; // Session is null, user is not authenticated
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <SideNavbar />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-3xl font-semibold mb-4">
          Welcome to your Dashboard
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Assigned Work Orders</h3>

          <table className="min-w-full mt-4 table-auto">
            <thead>
              <tr>
                <th className="border px-4 py-2 text-left">View Details</th>
                <th className="border px-4 py-2 text-left">Site/Location</th>
                <th className="border px-4 py-2 text-left">Service Type</th>
                <th className="border px-4 py-2 text-left">WO Number</th>
                <th className="border px-4 py-2 text-left">Title</th>
                <th className="border px-4 py-2 text-left">Status</th>
                <th className="border px-4 py-2 text-left">Due Date</th>
                <th className="border px-4 py-2 text-left">
                  Specific Location
                </th>
              </tr>
            </thead>
            <tbody>
              {workorders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center p-4">
                    No work orders found.
                  </td>
                </tr>
              ) : (
                workorders.map((workorder) => (
                  <tr key={workorder.WO_NUMBER}>
                    <td
                      className="border px-4 py-2 text-blue-500 cursor-pointer"
                      onClick={() => handleViewClick(workorder.WO_NUMBER)}
                    >
                      View
                    </td>
                    <td className="border px-4 py-2">{workorder.PROJECT}</td>
                    <td className="border px-4 py-2">{workorder.WO_TYPE}</td>
                    <td className="border px-4 py-2">{workorder.WO_NUMBER}</td>
                    <td className="border px-4 py-2">{workorder.WO_TITLE}</td>
                    <td className="border px-4 py-2">{workorder.WO_STATUS}</td>
                    <td className="border px-4 py-2">{workorder.WO_DUEDATE}</td>
                    <td className="border px-4 py-2">
                      {workorder.WO_SPECIFICLOCATION}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>{`Page ${currentPage} of ${totalPages}`}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <WorkOderModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        workOrderDetails={workOrderHistory}
      />
    </div>
  );
};

export default DashboardPage;
