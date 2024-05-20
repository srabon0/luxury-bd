import React, { useState, useEffect } from "react";

const CountdownComponent = ({ value, label }) => (
  <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
    <span className="countdown font-mono text-5xl">
      <span style={{ "--value": value }}></span>
    </span>
    {label}
  </div>
);

const Countdown = () => {
  const [time, setTime] = useState({
    days: 20,
    hours: 10,
    minutes: 24,
    seconds: 51,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => {
        let { days, hours, minutes, seconds } = prevTime;

        if (seconds > 0) {
          seconds--;
        } else {
          if (minutes > 0) {
            minutes--;
            seconds = 59;
          } else {
            if (hours > 0) {
              hours--;
              minutes = 59;
              seconds = 59;
            } else {
              if (days > 0) {
                days--;
                hours = 23;
                minutes = 59;
                seconds = 59;
              } else {
                clearInterval(timer);
                // You may add additional logic here when the timer reaches zero
              }
            }
          }
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <h1 className="text-center text-2xl pt-5">Coming Soon</h1>

      <div className="flex items-center justify-center py-10">
        <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
          <CountdownComponent value={time.days} label="days" />
          <CountdownComponent value={time.hours} label="hours" />
          <CountdownComponent value={time.minutes} label="min" />
          <CountdownComponent value={time.seconds} label="sec" />
        </div>
      </div>
    </>
  );
};

export default Countdown;
