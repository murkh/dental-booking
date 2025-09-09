
"use client";

interface BookingStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSuccess: boolean;
  message: string;
  successTitle?: string;
  errorTitle?: string;
  successMessage?: string;
  errorMessage?: string;
}

export function BookingStatusModal({
  isOpen,
  onClose,
  isSuccess,
  message,
  successTitle = "Appointment Booked Successfully!",
  errorTitle = "Booking Failed",
}: BookingStatusModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isSuccess ? "bg-green-100" : "bg-red-100"
          }`}
        >
          {isSuccess ? (
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>Success</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>Error</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isSuccess ? successTitle : errorTitle}
        </h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors"
        >
          {isSuccess ? "Book Another Appointment" : "Try Again"}
        </button>
      </div>
    </div>
  );
}
