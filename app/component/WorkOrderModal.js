// components/WorkOrderModal.js
import React from "react";

const WorkOrderModal = ({ isOpen, onClose, workOrderDetails }) => {
  if (!isOpen) return null;
  const { WO_NUMBER, DESCRIPTION } = workOrderDetails?.[0] || {};
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h3 className="text-xl font-semibold mb-4">Work Order Details</h3>

        {/* Display Work Order Details */}
        {workOrderDetails ? (
          <div>
            <p>
              <strong>WO Number:</strong> {WO_NUMBER}
            </p>
            <p>
              <strong>Estimate:</strong>
            </p>
            <div
              className="description-text"
              dangerouslySetInnerHTML={{ __html: DESCRIPTION }}
            ></div>
          </div>
        ) : (
          <p>Loading...</p>
        )}

        {/* Close Button */}
        <div className="mt-4 text-right">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkOrderModal;
