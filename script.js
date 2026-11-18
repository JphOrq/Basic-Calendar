var date = new Date();
var year = date.getFullYear();
var allMonthsContainer = document.querySelector(".all-months");
var yearDropdown = document.getElementById("year-dropdown");

// Array of month names
var months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Philippine Holidays
// type: "regular-holiday" | "special-non-working" | "special-working"
var baseHolidays = {
  January: { 1: { type: "regular-holiday", name: "New Year's Day" } },
  February: { 25: { type: "special-working", name: "EDSA People Power Revolution Anniversary" } },
  March: {},
  April: { 9: { type: "regular-holiday", name: "Araw ng Kagitingan (Day of Valor)" } },
  May: { 1: { type: "regular-holiday", name: "Labor Day" } },
  June: { 12: { type: "regular-holiday", name: "Independence Day" } },
  July: {},
  August: { 21: { type: "special-non-working", name: "Ninoy Aquino Day" } },
  September: {},
  October: {},
  November: {
    1: { type: "special-non-working", name: "All Saints' Day" },
    2: { type: "special-non-working", name: "All Souls' Day" },
    30: { type: "regular-holiday", name: "Bonifacio Day" },
  },
  December: {
    24: { type: "special-non-working", name: "Christmas Eve" },
    25: { type: "regular-holiday", name: "Christmas Day" },
    30: { type: "regular-holiday", name: "Rizal Day" },
    31: { type: "special-non-working", name: "Last Day of the Year" },
  },
};

// Function to generate holidays for each year
var generateHolidays = (startYear, yearsToAdd) => {
  var holidays = {};
  for (var i = 0; i <= yearsToAdd; i++) {
    var currentYear = startYear + i;
    holidays[currentYear] = JSON.parse(JSON.stringify(baseHolidays));
  }
  return holidays;
};

// Generate holiday data for the current year plus 5 years
var holidays = generateHolidays(year, 5);

// Function to generate the calendar for a month
var generateCalendar = (year, month) => {
  var dayone = new Date(year, month, 1).getDay();
  var lastdate = new Date(year, month + 1, 0).getDate();
  var dayend = new Date(year, month, lastdate).getDay();
  var monthlastdate = new Date(year, month, 0).getDate();

  var lit = "";
  for (var i = dayone; i > 0; i--) {
    lit += `<li class="inactive">${monthlastdate - i + 1}</li>`;
  }

  for (var i = 1; i <= lastdate; i++) {
    var isToday =
      i === date.getDate() &&
      month === new Date().getMonth() &&
      year === new Date().getFullYear()
        ? "active"
        : "";
    var dayOfWeek = new Date(year, month, i).getDay();
    var sundayClass = dayOfWeek === 0 ? "sunday" : "";

    var holidayInfo =
      holidays[year] &&
      holidays[year][months[month]] &&
      holidays[year][months[month]][i]
        ? holidays[year][months[month]][i]
        : null;
    var holidayClass = holidayInfo ? holidayInfo.type : "";
    var holidayTitle = holidayInfo ? ` title="${holidayInfo.name}"` : "";

    lit += `<li class="${isToday} ${sundayClass} ${holidayClass}"${holidayTitle}>${i}</li>`;
  }

  for (var i = dayend; i < 6; i++) {
    lit += `<li class="inactive">${i - dayend + 1}</li>`;
  }

  return lit;
};

// Function to render all months of a year
var renderYear = (year) => {
  allMonthsContainer.innerHTML = "";
  months.forEach((month, index) => {
    var monthContainer = document.createElement("div");
    monthContainer.classList.add("month-container");
    monthContainer.innerHTML = `
      <header class="calendar-header">
        <p>${month} ${year}</p>
      </header>
      <div class="calendar-body">
        <ul class="calendar-weekdays">
          <li class="sunday">Sun</li>
          <li>Mon</li>
          <li>Tue</li>
          <li>Wed</li>
          <li>Thu</li>
          <li>Fri</li>
          <li>Sat</li>
        </ul>
        <ul class="calendar-dates">
          ${generateCalendar(year, index)}
        </ul>
      </div>
    `;
    allMonthsContainer.appendChild(monthContainer);
  });
};

var populateYearDropdown = () => {
  for (var i = year; i <= year + 5; i++) {
    var option = document.createElement("option");
    option.value = i;
    option.text = i;
    yearDropdown.appendChild(option);
  }
};

var updateYearFromDropdown = () => {
  year = parseInt(yearDropdown.value);
  renderYear(year);
};

populateYearDropdown();
yearDropdown.addEventListener("change", updateYearFromDropdown);
renderYear(year);

document.getElementById("export-pdf").addEventListener("click", function () {
  var { jsPDF } = window.jspdf;
  var doc = new jsPDF("p", "mm", "a4");
  var pageWidth = doc.internal.pageSize.getWidth();
  var pageHeight = doc.internal.pageSize.getHeight();
  var months = document.querySelectorAll(".month-container");
  var y = 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(79, 70, 229);
  doc.text("Philippine Calendar " + year, pageWidth / 2, 15, { align: "center" });

  for (var m = 0; m < months.length; m++) {
    if (y > pageHeight - 40) {
      doc.addPage();
      y = 10;
    }

    var monthEl = months[m];
    var monthTitle = monthEl.querySelector(".calendar-header p").textContent;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text(monthTitle, 15, y + 10);
    y += 18;

    var dates = monthEl.querySelectorAll(".calendar-dates li");
    var weekDays = monthEl.querySelectorAll(".calendar-weekdays li");

    var cellW = (pageWidth - 30) / 7;
    var cellH = 10;
    var startX = 15;

    weekDays.forEach(function (wd, i) {
      doc.setFontSize(9);
      doc.setTextColor(wd.classList.contains("sunday") ? 220 : 100, wd.classList.contains("sunday") ? 38 : 64, wd.classList.contains("sunday") ? 38 : 74);
      doc.text(wd.textContent, startX + i * cellW + cellW / 2, y + 6, { align: "center" });
    });
    y += cellH;

    doc.setDrawColor(226, 232, 240);
    dates.forEach(function (d, i) {
      var col = i % 7;
      var row = Math.floor(i / 7);
      var x = startX + col * cellW;
      var yy = y + row * cellH;

      doc.rect(x, yy, cellW, cellH);

      if (!d.classList.contains("inactive")) {
        doc.setFontSize(10);
        if (d.classList.contains("sunday") || d.classList.contains("regular-holiday") || d.classList.contains("special-non-working") || d.classList.contains("special-working")) {
          doc.setTextColor(220, 38, 38);
          doc.setFont("helvetica", "bold");
        } else {
          doc.setTextColor(30, 41, 59);
          doc.setFont("helvetica", "normal");
        }
        doc.text(d.textContent, x + cellW / 2, yy + cellH / 2 + 3, { align: "center" });
      }
    });

    y += Math.ceil(dates.length / 7) * cellH + 14;
  }

  doc.save("Philippine-Calendar-" + year + ".pdf");
});
