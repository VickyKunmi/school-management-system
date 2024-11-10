"use client";

import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
// import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";

const localizer = momentLocalizer(moment);

const BigCalendar = ({
  data,
}: {
  data: { title: string; start: Date; end: Date }[];
}) => {
  const [view, setView] = useState<View>(Views.WORK_WEEK);

  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };

  return (
    <Calendar
      localizer={localizer}
      events={data}
      startAccessor="start"
      endAccessor="end"
      titleAccessor="title"
      views={["work_week", "day"]}
      view={view}
      // style={{ height: "98%" }}
      style={{ height: "100%", width: "100%" }}
      onView={handleOnChangeView}
      min={new Date(2025, 10, 10, 8, 0)}
      max={new Date(2025, 10, 10, 17, 0)}
      
    />
  );
};

export default BigCalendar;
