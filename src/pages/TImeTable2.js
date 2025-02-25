import React from "react";

const TimeTable2 = () => {
  const scheduleData = [
    {
      sno: "28 Jan - 2 Feb",
      week: [
        {
          day: "Tuesday",
          periods: [{ time: "15:30", Calista: "AP03 cvc an" }],
        },
        {
          day: "Wednesday",
          periods: [
            { time: "15:30", Jen: "Grad", XP: "AP 71.2 vowels oa, oe, ow" },
            { time: "15:45", Jen: "Grad", XP: "AP 71.2 vowels oa, oe, ow" },
          ],
        },
        {
          day: "Thursday",
          periods: [
            { time: "15:30", Calista: "AP 32 cvc all", XP: "h bro wh" },
          ],
        },
        {
          day: "Friday",
          periods: [
            {
              time: "15:30",
              Calista: "AD/q/ /s/",
              XP: "AP 75 - ghost wr Obs XP",
            },
            {
              time: "15:30",
              Calista: "AD/q/ /s/",
              XP: "AP 75 - ghost wr Obs XP",
            },
            {
              time: "15:30",
              Calista: "AD/q/ /s/",
              XP: "AP 75 - ghost wr Obs XP",
            },
          ],
        },
        {
          day: "Saturday",
          periods: [
            {
              time: "09:00",
              Calista: "AP74 oi oy 2",
              XP: "AP80 silent e a_e/ea_oe",
            },
          ],
        },
        {
          day: "Sunday",
          periods: [
            { time: "10:00", Calista: "AP90 review", XP: "Weekend recap" },
            { time: "10:00", Calista: "AP90 review", XP: "Weekend recap" },
            { time: "10:00", Calista: "AP90 review", XP: "Weekend recap" },
            { time: "10:00", Calista: "AP90 review", XP: "Weekend recap" },
          ],
        },
      ],
    },
    {
      sno: "4 Feb - 10 Feb",
      week: [
        {
          day: "Tuesday",
          periods: [{ time: "15:30", Calista: "AP03 cvc an" }],
        },
        {
          day: "Wednesday",
          periods: [
            { time: "15:30", Jen: "Grad", XP: "AP 71.2 vowels oa, oe, ow" },
          ],
        },
        {
          day: "Thursday",
          periods: [
            { time: "15:30", Calista: "AP 32 cvc all", XP: "h bro wh" },
          ],
        },
        {
          day: "Friday",
          periods: [
            {
              time: "15:30",
              Calista: "AD/q/ /s/",
              XP: "AP 75 - ghost wr Obs XP",
            },
          ],
        },
        {
          day: "Saturday",
          periods: [
            {
              time: "09:00",
              Calista: "AP74 oi oy 2",
              XP: "AP80 silent e a_e/ea_oe",
            },
          ],
        },
        {
          day: "Sunday",
          periods: [
            { time: "10:00", Calista: "AP91 weekend", XP: "Relax & revise" },
          ],
        },
      ],
    },
    {
      sno: "12 Feb - 17 Feb",
      week: [
        {
          day: "Tuesday",
          periods: [{ time: "15:30", Calista: "AP03 cvc an" }],
        },
        {
          day: "Wednesday",
          periods: [
            { time: "15:30", Jen: "Grad", XP: "AP 71.2 vowels oa, oe, ow" },
          ],
        },
        {
          day: "Thursday",
          periods: [
            { time: "15:30", Calista: "AP 32 cvc all", XP: "h bro wh" },
          ],
        },
        {
          day: "Friday",
          periods: [
            {
              time: "15:30",
              Calista: "AD/q/ /s/",
              XP: "AP 75 - ghost wr Obs XP",
            },
          ],
        },
        {
          day: "Saturday",
          periods: [
            {
              time: "09:00",
              Calista: "AP74 oi oy 2",
              XP: "AP80 silent e a_e/ea_oe",
            },
          ],
        },
        {
          day: "Sunday",
          periods: [
            {
              time: "10:00",
              Calista: "AP92 fun day",
              XP: "Game-based learning",
            },
          ],
        },
      ],
    },
  ];

  console.log("scheduleData",scheduleData)

  return (
    <div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th className="text-center fw-medium">Period</th>
            <th className="text-center fw-medium">Day</th>
            <th className="text-center fw-medium">Time</th>
            <th className="text-center fw-medium">Calista</th>
            <th className="text-center fw-medium">Jen</th>
            <th className="text-center fw-medium">XP</th>
          </tr>
        </thead>
        <tbody>
          {scheduleData.map((entry, snoIndex) =>
            entry.week.map((dayEntry, dayIndex) =>
              dayEntry.periods.map((period, periodIndex) => (
                <tr key={`${snoIndex}-${dayIndex}-${periodIndex}`}>
                  {/* Merge S.No Column for First Period of Each Student Data */}
                  {dayIndex === 0 && periodIndex === 0 && (
                    <td
                      rowSpan={entry.week.reduce(
                        (acc, day) => acc + day.periods.length,
                        0
                      )}
                    >
                      {entry.sno}
                    </td>
                  )}

                  {/* Merge Day Column for the Same Day */}
                  {periodIndex === 0 && (
                    <td rowSpan={dayEntry.periods.length}>{dayEntry.day}</td>
                  )}

                  {/* Time */}
                  <td className="text-center">{period.time}</td>

                  {/* Subjects */}
                  <td className="text-center">{period.Calista || ""}</td>
                  <td className="text-center">{period.Jen || ""}</td>
                  <td className="text-center">{period.XP || ""}</td>
                </tr>
              ))
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TimeTable2;
