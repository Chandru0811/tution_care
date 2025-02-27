import React from "react";

const TimeTable2 = () => {
  const scheduleData = [
    {
      sno: "28 Jan - 2 Feb",
      week: [
        {
          day: "Tuesday",
          periods: [
            {
              time: "15:30",
              teacherList: [
                { teacherName: "Calista", class: "AP03 cvc an" },
              ],
            },
            {
              time: "17:00",
              teacherList: [
                { teacherName: "Calista", class: "AB c" },
              ],
            },
            {
              time: "19:00",
              teacherList: [
                { teacherName: "Calista", class: "AP 59 silent E story" },
              ],
            },
          ],
        },
        {
          day: "Wednesday",
          periods: [
            {
              time: "15:30",
              teacherList: [
                { teacherName: "Jen", class: "Grad" },
                { teacherName: "XP", class: "AP 71.2 vowels oa, oe, ow" },
              ],
            },
          ],
        },
        {
          day: "Thursday",
          periods: [
            {
              time: "15:30",
              teacherList: [
                { teacherName: "Calista", class: "AP 32 cvc all" },
                { teacherName: "XP", class: "h bro wh" },
              ],
            },
          ],
        },
        {
          day: "Friday",
          periods: [
            {
              time: "15:30",
              teacherList: [
                { teacherName: "Calista", class: "AD/q/ /s/" },
                { teacherName: "XP", class: "AP 75 - ghost wr Obs XP" },
              ],
            },
          ],
        },
        {
          day: "Saturday",
          periods: [
            {
              time: "09:00",
              teacherList: [
                { teacherName: "Calista", class: "AP74 oi oy 2" },
                { teacherName: "XP", class: "AP80 silent e a_e/ea_oe" },
              ],
            },
          ],
        },
        {
          day: "Sunday",
          periods: [
            {
              time: "10:00",
              teacherList: [
                { teacherName: "Calista", class: "AP90 review" },
                { teacherName: "XP", class: "Weekend recap" },
              ],
            },
          ],
        },
      ],
    },
    {
      sno: "4 Mar - 9 Mar",
      week: [
        {
          day: "Tuesday",
          periods: [
            {
              time: "15:30",
              teacherList: [
                { teacherName: "Calista", class: "AP03 cvc an" },
              ],
            },
            {
              time: "17:00",
              teacherList: [
                { teacherName: "Calista", class: "AB c" },
              ],
            },
          ],
        },
        {
          day: "Wednesday",
          periods: [
            {
              time: "15:30",
              teacherList: [
                { teacherName: "Jen", class: "Grad" },
                { teacherName: "XP", class: "AP 71.2 vowels oa, oe, ow" },
              ],
            },
            {
              time: "17:00",
              teacherList: [
                { teacherName: "Jen", class: "Grad" },
                { teacherName: "XP", class: "AP 71.2 vowels oa, oe, ow" },
              ],
            },
          ],
        },
        {
          day: "Thursday",
          periods: [
            {
              time: "15:30",
              teacherList: [
                { teacherName: "Mogana", class: "AP 32 cvc all" },
                { teacherName: "Vivian", class: "h bro wh" },
              ],
            },
          ],
        },
        {
          day: "Friday",
          periods: [
            {
              time: "15:30",
              teacherList: [
                { teacherName: "Calista", class: "AD/q/ /s/" },
                { teacherName: "XP", class: "AP 75 - ghost wr Obs XP" },
              ],
            },
          ],
        },
        {
          day: "Saturday",
          periods: [
            {
              time: "09:00",
              teacherList: [
                { teacherName: "Calista", class: "AP74 oi oy 2" },
                { teacherName: "XP", class: "AP80 silent e a_e/ea_oe" },
              ],
            },
          ],
        },
        {
          day: "Sunday",
          periods: [
            {
              time: "10:00",
              teacherList: [
                { teacherName: "Jing En", class: "AP90 review" },
                { teacherName: "Joyce", class: "Weekend recap" },
              ],
            },
          ],
        },
      ],
    },
  ];

  const allTeachers = Array.from(
    new Set(
      scheduleData.flatMap((entry) =>
        entry.week.flatMap((day) =>
          day.periods.flatMap((period) =>
            period.teacherList.map((t) => t.teacherName)
          )
        )
      )
    )
  );

  return (
    <div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th className="text-center fw-medium">Period</th>
            <th className="text-center fw-medium">Day</th>
            <th className="text-center fw-medium">Time</th>
            {allTeachers.map((teacher) => (
              <th key={teacher} className="text-center fw-medium">
                {teacher}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {scheduleData.map((entry, snoIndex) =>
            entry.week.map((dayEntry, dayIndex) =>
              dayEntry.periods.map((period, periodIndex) => (
                <tr key={`${snoIndex}-${dayIndex}-${periodIndex}`}>
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

                  {periodIndex === 0 && (
                    <td rowSpan={dayEntry.periods.length}>{dayEntry.day}</td>
                  )}

                  <td className="text-center">{period.time}</td>

                  {allTeachers.map((teacher) => {
                    const teacherClass = period.teacherList.find(
                      (t) => t.teacherName === teacher
                    );
                    return (
                      <td key={teacher} className="text-center">
                        {teacherClass ? teacherClass.class : ""}
                      </td>
                    );
                  })}
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
