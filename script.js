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

// Base holiday data
var baseHolidays = {
  January: { 1: "regular-holiday" },
  February: { 25: "regular-holiday", 10: "special-non-working" },
  March: {
    28: "regular-holiday",
    29: "regular-holiday",
    30: "special-non-working",
  },
  April: { 9: "regular-holiday", 10: "special-non-working" },
  May: { 1: "regular-holiday" },
  June: { 12: "regular-holiday", 17: "regular-holiday" },
  August: { 21: "special-non-working", 26: "regular-holiday" },
  November: {
    1: "special-non-working",
    2: "special-non-working",
    30: "regular-holiday",
  },
  December: {
    24: "special-non-working",
    25: "regular-holiday",
    30: "regular-holiday",
    31: "special-non-working",
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
        ? "" //"active"
        : "";
    var dayOfWeek = new Date(year, month, i).getDay();
    var sundayClass = dayOfWeek === 0 ? "sunday" : "";
    var holidayClass =
      holidays[year] &&
      holidays[year][months[month]] &&
      holidays[year][months[month]][i]
        ? holidays[year][months[month]][i]
        : "";
    lit += `<li class="${isToday} ${sundayClass} ${holidayClass}">${i}</li>`;
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
