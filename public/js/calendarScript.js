const header = document.querySelector(".calendar h3");
const dates = document.querySelector(".dates");
const navs = document.querySelectorAll("#prev, #next");

const startDateInput = document.getElementById('start_date');
const endDateInput = document.getElementById('end_date');

const saunasInput = document.getElementById('saunas');

let days;
let previousMonth;
let nextMonth;
let bookedDays;
let chosenDays = [];
let saunas = 0;

const rentPrice = 1200;
const saunaPrice = 200;


const months = [
   "Styczeń",
   "Luty",
   "Marzec",
   "Kwiecień",
   "Maj",
   "Czerwiec",
   "Lipiec",
   "Sierpień",
   "Wrzesień",
   "Październik",
   "Listopad",
   "Grudzień",
];

let date = new Date();
let month = date.getMonth();
let year = date.getFullYear();

function formatDate(date) {
   return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function compareDates(firstDate, secondDate) {
   return firstDate.getDate() === secondDate.getDate() &&
         firstDate.getMonth() === secondDate.getMonth() &&
         firstDate.getFullYear() === secondDate.getFullYear();
}

function isDateBetween(dateToCheck, startDate, endDate) {
   
    const date = new Date(dateToCheck);
    const start = new Date(startDate);
    const end = new Date(endDate);

    return date > start && date < end;
}

function getDatesBetween(startDate, endDate) {
   const dates = [];
   let currentDate = new Date(startDate);
   const end = new Date(endDate);

   while (currentDate <= end) {
      dates.push(formatDate(new Date(currentDate)));
      currentDate.setDate(currentDate.getDate() + 1);
   }
   return dates;
}

function performClick(id) {
   if (chosenDays.length > 1) {
      startDateInput.value = null;
      endDateInput.value = null;
      chosenDays = [];
      renderCalendar();
      setPrice();
      return;
   }

   if (chosenDays.length === 1) {
      const [start, end] = [new Date(chosenDays[0]), new Date(id)].sort((a, b) => a - b);
      const dateRange = getDatesBetween(start, end);
      
      const hasReservedDays = dateRange.some(date => 
         reservations.some(reservation => 
            isDateBetween(date, reservation.start_date, reservation.end_date)
         )
      );

      if (!hasReservedDays) {
         chosenDays = dateRange;
         startDateInput.value = chosenDays[0];
         endDateInput.value = chosenDays[chosenDays.length - 1];
      } else {
         chosenDays = [];
      }
      setPrice();
   } else {
      chosenDays.push(id);
   }
   renderCalendar();
}


function renderCalendar() {
   const firstDay = new Date(year, month, 1);
   const lastDay = new Date(year, month + 1, 0);
   const today = new Date();
   
   let datesHtml = "";
   
   const prevMonthDays = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
   for (let i = prevMonthDays; i > 0; i--) {
      const prevDate = new Date(year, month, 1 - i);
      datesHtml += `<li class="previousMonth">${prevDate.getDate()}</li>`;
   }

   for (let i = 1; i <= lastDay.getDate(); i++) {
      const currentDate = new Date(year, month, i);
      const dateString = formatDate(currentDate);
      
      let className = 'dayOfMonth'; 
      if (currentDate < today) { 
         className = 'inactive'; 
      } else if(reservations.some(r => r.start_date === dateString)) { 
         className = 'reservedFirstDay'; 
      } else if (reservations.some(r => r.end_date === dateString)) { 
         className = 'reservedLastDay'; 
      } else if (reservations.some(r => isDateBetween(dateString, r.start_date, r.end_date))) { 
         className = 'reserved'; 
      } else if (chosenDays.includes(dateString)) { 
          if (dateString === chosenDays[0]) { 
            className += ' firstDay'; 
          } else if (dateString === chosenDays[chosenDays.length - 1]) { 
            className += ' lastDay'; 
          } else { 
            className = 'bookedDay'; 
          } 
      }
      
      datesHtml += `<li class="${className}" id="${dateString}">${i}</li>`;
   }

   const remainingDays = 42 - (prevMonthDays + lastDay.getDate());
   for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(year, month + 1, i);
      const dateString = formatDate(nextDate);
      
      let className = 'nextMonth';

      if (nextDate.getMonth() <= new Date().getMonth() && nextDate.getFullYear() <= new Date().getFullYear()) {
         className = 'inactive';
      } else if(reservations.some(r => r.start_date === dateString)) { 
         className = 'reservedFirstDay'; 
      } else if (reservations.some(r => r.end_date === dateString)) { 
         className = 'reservedLastDay'; 
      } else if (reservations.some(r => isDateBetween(dateString, r.start_date, r.end_date))) { 
         className = 'reserved'; 
      } else if (chosenDays.includes(dateString)) { 
          if (dateString === chosenDays[0]) { 
            className += ' firstDay'; 
          } else if (dateString === chosenDays[chosenDays.length - 1]) { 
            className += ' lastDay'; 
          } else { 
            className = 'bookedDay'; 
          } 
      }
      
      datesHtml += `<li class="${className}" id="${dateString}">${i}</li>`;
   }

   dates.innerHTML = datesHtml;
   header.textContent = `${months[month]} ${year}`;

   document.querySelectorAll('.dates li:not(.inactive)').forEach(day => {
      day.addEventListener('click', e => performClick(e.target.id));
   });
}

document.querySelector('.subtract').addEventListener('click', (e) => {
   e.preventDefault();
   if (saunas > 0) saunas--;
   saunasInput.value = saunas;
   setPrice()
});

document.querySelector('.add').addEventListener('click', (e) => {
   e.preventDefault();
   saunas++;
   saunasInput.value = saunas;
   setPrice()

});

document.getElementById('form').addEventListener('submit', function(event) {
   const errorMessage = document.querySelector('.error-message');
   const termsCheckbox = document.getElementById('terms');
   

   if (!startDateInput.value || !endDateInput.value) {
      event.preventDefault();
      
      errorMessage.style.display = 'block';
      errorMessage.textContent = 'Wybierz termin przed zarezerwowaniem!';
   } else if (!termsCheckbox.checked) {
      event.preventDefault();

        errorMessage.style.display = 'block';
        errorMessage.textContent = 'Musisz zaakceptować regulamin i politykę prywatności!';
      
   } else {
      errorMessage.style.display = 'none';
   }
});

navs.forEach((nav) => {
   nav.addEventListener("click", (e) => {
      const btnId = e.target.id;

      if (btnId === "prev" && month === 0) {
         year--;
         month = 11;
      } else if (btnId === "next" && month === 11) {
         year++;
         month = 0;
      } else if (btnId === "next") {
         month++;
      } else if (btnId === "prev") {
         month--;
      } 

      date = new Date(year, month, new Date().getDate());
      year = date.getFullYear();
      month = date.getMonth();

      renderCalendar();
   });
});

function setPrice() {
   const nights = Math.max(0, chosenDays.length - 1);
   const price = (nights * rentPrice) + (saunas * saunaPrice);
   document.getElementById("price").value = Math.max(0, price);
}

renderCalendar();