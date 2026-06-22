import React, { useEffect, useState } from "react";

export default function PartyPopper({ trigger }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (trigger) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <>
      <style>{`
        @keyframes popperFly {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          50% { transform: translate(150px, -150px) scale(1.3); }
          100% { transform: translate(300px, -300px) scale(0.8); opacity: 0; }
        }
        .animate-popperFly {
          animation: popperFly 2.5s ease-out forwards;
        }
      `}</style>

      {show && (
        <div className="fixed bottom-4 left-4 text-4xl animate-popperFly select-none">
          🎉
        </div>
      )}
    </>
  );
}
