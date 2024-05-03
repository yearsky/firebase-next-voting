import React from "react";

interface SuccessMessageProps {
  successMessage: boolean;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ successMessage }) => {
  return (
    <div
      className={`fixed top-5 z-[9999px] right-3 p-2 rounded-md bg-green-400 text-white ${
        successMessage ? "slide-in" : "slide-out"
      }`}
    >
      <h4>Horray!🎉 Jawaban Kamu Terkirim😉</h4>
    </div>
  );
};

export default SuccessMessage;
