import "./index.css";
import { getDaysOfMonth } from "./utils";
import { useMemo, useState } from "react";
import dayjs from "dayjs";
// import "dayjs/locale/en-us";
// dayjs.locale('en')

export default function Calendar() {
  const [month, setMonth] = useState(dayjs());

  const days = useMemo(() => {
    return getDaysOfMonth(month.year(), month.month() + 1);
  }, [month]);

  // days.forEach((day) => console.log(day.format("YYYY-MM-DD")));

  const weekTitles = useMemo(() => {
    return [...Array(7)].map((_, weekInx) => {
      return dayjs().day(weekInx);
    });
  }, []);

  const onMonthSwitch = (action: number) => {
    setMonth((month) => {
      return month.add(action, "month");
    });
  };

  const currentDate = dayjs().format("YYYY-MM-DD");

  return (
    <div className="App">
      <div className="calendar">
        <div className="calendar-month">
          <div
            className="calendar-month-switch"
            onClick={() => onMonthSwitch(-1)}
          >
            {"<"}
          </div>
          <div>{month.format("MMM YYYY")}</div>
          <div
            className="calendar-month-switch"
            onClick={() => onMonthSwitch(1)}
          >
            {">"}
          </div>
        </div>
        <div className="calendar-title">
          {weekTitles.map((title, index) => {
            return (
              <div className="calendar-week" key={index}>
                {title.format("dd")}
              </div>
            );
          })}
        </div>
        <div className="calendar-content">
          {days.map((day, index) => {
            return (
              <div className="calendar-day" key={index}>
                {day.format("YYYY-MM-DD") === currentDate ? (
                  <span style={{ textAlign: "center" }}>Check in</span>
                ) : (
                  day.format("DD")
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
