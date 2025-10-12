import React, { useState, useEffect } from "react";

const ComingSoon = () => {
  const launchDate = new Date("2025-10-20T00:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="coming-soon">
      {/* Video Section */}
      <div className="video-container">
        <video autoPlay loop playsInline controls className="video">
          <source src="/second final render.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Text & Countdown Section */}
      <div className="text-container">
        <h1>Launching Soon 🚀</h1>
        <p>Mark your calendars: 20th October 2025</p>
        <div className="countdown">
          {["days", "hours", "minutes", "seconds"].map((unit) => (
            <div key={unit} className="time-unit">
              <h2>{timeLeft[unit]}</h2>
              <p>{unit}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500&family=Playfair+Display:wght@600;700&display=swap');

        .coming-soon {
          display: flex;
          height: 100vh;
          width: 100%;
          font-family: 'Montserrat', sans-serif;
          color: #fff;
          overflow: hidden;
        }

        /* Video side */
        .video-container {
          flex: 1;
          position: relative;
        }

        .video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Text side */
        .text-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: linear-gradient(to bottom right, rgba(0,0,0,0.7), rgba(0,0,0,0.9));
          padding: 50px 30px;
          text-align: center;
        }

        h1 {
          font-family: 'Playfair Display', serif;
          font-size: 3.5rem;
          margin-bottom: 1rem;
          background: linear-gradient(90deg, #f8e1b5, #d4af37);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        p {
          font-size: 1.25rem;
          margin-bottom: 2rem;
          color: rgba(255,255,255,0.8);
        }

        .countdown {
          display: flex;
          justify-content: center;
          gap: 25px;
          flex-wrap: wrap;
        }

        .time-unit {
          text-align: center;
          min-width: 70px;
        }

        .time-unit h2 {
          font-size: 2.5rem;
          font-family: 'Playfair Display', serif;
          background: linear-gradient(180deg, #f8ecc2, #cfa66b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .time-unit p {
          text-transform: uppercase;
          font-size: 0.85rem;
          letter-spacing: 1px;
          color: rgba(255,255,255,0.7);
        }

        @media (max-width: 1024px) {
          .coming-soon { flex-direction: column; }
          .video-container, .text-container { flex: unset; width: 100%; height: 50vh; }
          h1 { font-size: 2.5rem; }
        }

        @media (max-width: 480px) {
          h1 { font-size: 2rem; }
          .time-unit h2 { font-size: 1.5rem; }
        }
      `}</style>
    </div>
  );
};

export default ComingSoon;
