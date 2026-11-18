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
    var holidayData = holidayInfo
      ? ` data-holiday-name="${holidayInfo.name}" data-holiday-type="${holidayInfo.type}"`
      : "";

    lit += `<li class="${isToday} ${sundayClass} ${holidayClass}"${holidayTitle}${holidayData}>${i}</li>`;
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

// Get the current year
var currentYear = new Date().getFullYear();

// Update the content of the element with id="currentYear"
document.addEventListener("DOMContentLoaded", function () {
  var currentYearEl = document.getElementById("currentYear");
  if (currentYearEl) {
    currentYearEl.textContent = currentYear;
  } else {
    console.warn("Element #currentYear not found");
  }
});

// Holiday Modal
var holidayModal = document.getElementById("holiday-modal");
var modalOverlay = document.getElementById("modal-overlay");
var modalClose = document.getElementById("modal-close");
var modalTitle = document.getElementById("modal-title");
var modalDate = document.getElementById("modal-date");
var modalHolidayName = document.getElementById("modal-holiday-name");
var modalHolidayType = document.getElementById("modal-holiday-type");

function openHolidayModal(day, monthName, yearVal, holidayName, holidayType, isWeekend) {
  modalTitle.textContent = holidayName ? holidayName : "No Holiday";
  modalDate.textContent = monthName + " " + day + ", " + yearVal;

  if (holidayName) {
    modalHolidayName.textContent = holidayName;
    modalHolidayName.style.display = "block";
    var typeLabel = holidayType
      .replace("regular-holiday", "Regular Holiday")
      .replace("special-non-working", "Special (Non-Working) Day")
      .replace("special-working", "Special (Working) Day");
    modalHolidayType.textContent = typeLabel + (isWeekend ? " • No working day" : "");
    modalHolidayType.style.display = "block";
  } else {
    if (isWeekend) {
      modalHolidayName.textContent = "No working day";
      modalHolidayName.style.display = "block";
      modalHolidayType.style.display = "none";
    } else {
      modalHolidayName.textContent = "This is a regular working day.";
      modalHolidayName.style.display = "block";
      modalHolidayType.style.display = "none";
    }
  }
  holidayModal.style.display = "block";
}

function closeHolidayModal() {
  holidayModal.style.display = "none";
}

allMonthsContainer.addEventListener("click", function (e) {
  var li = e.target.closest(".calendar-dates li");
  if (!li || li.classList.contains("inactive")) return;

  var day = parseInt(li.textContent);
  var monthContainer = li.closest(".month-container");
  var monthYear = monthContainer.querySelector(".calendar-header p").textContent;
  var parts = monthYear.split(" ");
  var monthName = parts[0];
  var yearVal = parseInt(parts[1]);

  var monthIndex = months.indexOf(monthName);
  var dayOfWeek = new Date(yearVal, monthIndex, day).getDay();
  var isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  var holidayName = li.getAttribute("data-holiday-name");
  var holidayType = li.getAttribute("data-holiday-type");

  openHolidayModal(day, monthName, yearVal, holidayName, holidayType, isWeekend);
});

modalClose.addEventListener("click", closeHolidayModal);
modalOverlay.addEventListener("click", closeHolidayModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && holidayModal.style.display === "block") {
    closeHolidayModal();
  }
});

document.getElementById("export-pdf").addEventListener("click", function () {
  var { jsPDF } = window.jspdf;
  var doc = new jsPDF("l", "mm", "a4");
  var pageWidth = doc.internal.pageSize.getWidth();
  var pageHeight = doc.internal.pageSize.getHeight();
  var margin = 15;
  var usableWidth = pageWidth - margin * 2;
  var cellW = usableWidth / 7;
  var cellH = 22;
  var headerH = 12;
  var titleH = 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(79, 70, 229);
  doc.text("Philippine Calendar", pageWidth / 2, margin + 6, { align: "center" });

  var monthContainers = document.querySelectorAll(".month-container");

  monthContainers.forEach(function (monthEl, m) {
    if (m > 0) {
      doc.addPage();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(79, 70, 229);
      doc.text("Philippine Calendar", pageWidth / 2, margin + 6, { align: "center" });
    }

    var monthTitle = monthEl.querySelector(".calendar-header p").textContent;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text(monthTitle, margin, margin + titleH, { align: "left" });

    var dates = monthEl.querySelectorAll(".calendar-dates li");
    var weekDays = monthEl.querySelectorAll(".calendar-weekdays li");

    var gridTop = margin + titleH + headerH + 6;

    weekDays.forEach(function (wd, i) {
      doc.setFontSize(8);
      doc.setTextColor(wd.classList.contains("sunday") ? 220 : 100, wd.classList.contains("sunday") ? 38 : 64, wd.classList.contains("sunday") ? 38 : 74);
      doc.text(wd.textContent, margin + i * cellW + cellW / 2, gridTop - 4, { align: "center" });
    });

    doc.setDrawColor(226, 232, 240);
    dates.forEach(function (d, i) {
      var col = i % 7;
      var row = Math.floor(i / 7);
      var x = margin + col * cellW;
      var yy = gridTop + row * cellH;

      doc.rect(x, yy, cellW, cellH);

      if (!d.classList.contains("inactive")) {
        var holidayName = d.getAttribute("data-holiday-name");

        doc.setFontSize(10);
        if (d.classList.contains("sunday") || d.classList.contains("regular-holiday") || d.classList.contains("special-non-working") || d.classList.contains("special-working")) {
          doc.setTextColor(220, 38, 38);
          doc.setFont("helvetica", "bold");
        } else {
          doc.setTextColor(30, 41, 59);
          doc.setFont("helvetica", "normal");
        }
        doc.text(d.textContent, x + cellW / 2, yy + 7, { align: "center" });

        if (holidayName) {
          doc.setFontSize(5.5);
          doc.setTextColor(220, 38, 38);
          doc.setFont("helvetica", "bold");
          doc.text(holidayName, x + cellW / 2, yy + cellH - 2, { align: "center" });
        }
      }
    });
  });

  doc.save("Philippine-Calendar-" + year + ".pdf");
});
