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
   const year = date.getFullYear();
   const month = String(date.getMonth() + 1).padStart(2, '0'); // Miesiące są indeksowane od 0, więc dodajemy 1
   const day = String(date.getDate()).padStart(2, '0'); // Używamy padStart, aby mieć 2 cyfry

   return `${year}-${month}-${day}`;
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

    return date >= start && date <= end;
}

function performClick(id) {


   let index = chosenDays.indexOf(id);

   if (chosenDays.length > 1) {
      startDateInput.value = null;
      endDateInput.value = null;
      chosenDays = []; 
      renderCalendar();
      setPrice();
      return;
   }

   if (chosenDays.length === 1) {

      

      if(chosenDays[0] < id) {
         let firstDay = new Date(chosenDays[0]);
         let lastDay = new Date(id);

         let throughReservedDays = false;

         while (!compareDates(firstDay, lastDay)) {
            reservations.forEach(reservation => {
               if (isDateBetween(formatDate(firstDay), reservation.start_date, reservation.end_date)) {
                  chosenDays = [];
                  throughReservedDays = true;        
               }
            });

            if (throughReservedDays) break;

            firstDay.setDate(firstDay.getDate() + 1);       
            chosenDays.push(formatDate(firstDay));

         }

         if (chosenDays.length > 1) {
            startDateInput.value = chosenDays[0];
            endDateInput.value = chosenDays[chosenDays.length - 1];
            console.log(chosenDays)
         }

      } else {
         let firstDay = new Date(id);
         let lastDay = new Date(chosenDays[0]);

         
      

         let throughReservedDays = false;

         while (!compareDates(firstDay, lastDay)) {
            reservations.forEach(reservation => {
               if (isDateBetween(formatDate(firstDay), reservation.start_date, reservation.end_date)) {
                  chosenDays = [];
                  throughReservedDays = true;
               }
            });

            if (throughReservedDays) break;
            let newdate = formatDate(firstDay);
            firstDay.setDate(firstDay.getDate() + 1);    
            chosenDays.push(newdate);
         }

         if (chosenDays.length > 1) {
            chosenDays.sort();
            startDateInput.value = chosenDays[0];
            endDateInput.value = chosenDays[chosenDays.length - 1];
         }
         
      }
      setPrice();
   }

   
   if(index < 0) {
      chosenDays.push(id)
   } 
   renderCalendar();

}


function renderCalendar() {
   const start = new Date(year, month, 1).getDay();
   const endDate = new Date(year, month + 1, 0).getDate();
   const end = new Date(year, month, endDate).getDay();
   const endDatePrev = new Date(year, month, 0).getDate();

   let counter = 0;
   let datesHtml = "";
   let isSunday = start === 0;
   
   if(isSunday) {
      for (let i = 7; i > 1; i--) {
         const prevDay = endDatePrev - i + 2;
         const prevDate = new Date(year, month - 1, prevDay);
         const prevDateString = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}-${String(prevDate.getDate()).padStart(2, '0')}`;
         datesHtml += `<li class="previousMonth" id="${prevDateString}">${prevDay}</li>`;
         counter++;
      }

   } else {
      for (let i = start; i > 1; i--) {
         const prevDay = endDatePrev - i + 2;
         const prevDate = new Date(year, month - 1, prevDay);
         const prevDateString = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}-${String(prevDate.getDate()).padStart(2, '0')}`;
         datesHtml += `<li class="previousMonth">${prevDay}</li>`;
         counter++;
      }

   }

   

   for (let i = 1; i <= endDate; i++) {

      if (
         year < new Date().getFullYear() || // Jeśli rok jest wcześniejszy niż bieżący
         (year === new Date().getFullYear() && month < new Date().getMonth()) || // Jeśli rok jest ten sam, ale miesiąc wcześniejszy
         (year === new Date().getFullYear() && month === new Date().getMonth() && i < new Date().getDate()) // Jeśli to ten sam rok i miesiąc, ale dzień wcześniejszy
      ) {
         datesHtml += `<li class="inactive">${i}</li>`;
      } else {
         const currentDateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;

         let isReserved = false;
         let className;
         

         reservations.forEach(reservation => {
            if (isDateBetween(currentDateString, reservation.start_date, reservation.end_date)) {
               className = 'reserved';
               isReserved = true;
            }

         });

         if (!isReserved) {
            if (chosenDays.includes(currentDateString)) {
               className = 'bookedDay';
            } else {
               className = 'dayOfMonth';
            }
         }
         
         datesHtml += `<li class="${className}" id="${currentDateString}">${i}</li>`;
      }

      counter++;
   }

   let endMonthCounter = 1;
   while(counter < 42) {
      const nextDay = endMonthCounter;
      const nextDate = new Date(year, month + 1, nextDay);
      const nextDateString = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}-${String(nextDate.getDate()).padStart(2, '0')}`;

      let isReserved = false;

      reservations.forEach(reservation => {
         if (isDateBetween(nextDateString, reservation.start_date, reservation.end_date)) {
            className = 'reserved';
            isReserved = true;
         }

      });

      if (!isReserved) {
         if (chosenDays.includes(nextDateString)) {
            className = 'bookedDay';
         } else {
            className = 'nextMonth';
         }
      }


      

      datesHtml += `<li class="${className}" id="${nextDateString}">${nextDay}</li>`;
      counter++;
      endMonthCounter++;
   }

   dates.innerHTML = datesHtml;
   header.textContent = `${months[month]} ${year}`;

   days = document.querySelectorAll(".dates li.dayOfMonth, .dates li.nextMonth, .dates li.bookedDay");
   previousMonth = document.querySelectorAll(".dates li.previousMonth");

   days.forEach((day) => {
      day.addEventListener("click", (e) => {
         const id = e.target.id;

         performClick(id);

      })
   });
   previousMonth.forEach((day) => {
      day.addEventListener("click", (e) => {
         if (month === 0) {
            year--;
            month = 11;
         } else {
            month--;
         }
         date = new Date(year, month, new Date().getDate());
         year = date.getFullYear();
         month = date.getMonth();

         renderCalendar();
      });
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
   

   // Sprawdź, czy pola są puste
   if (!startDateInput.value || !endDateInput.value) {
      // Zablokuj wysłanie formularza
      event.preventDefault();
      
      // Pokaż komunikat o błędzie
      errorMessage.style.display = 'block';
      errorMessage.textContent = 'Wybierz termin przed zarezerwowaniem!';
   } else if (!termsCheckbox.checked) {
      event.preventDefault();

        errorMessage.style.display = 'block';
        errorMessage.textContent = 'Musisz zaakceptować regulamin i politykę prywatności!';
      
   } else {
      // Ukryj komunikat o błędzie, jeśli pola są poprawnie wypełnione
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

   let nights;

   const uniqueArray = chosenDays.reduce((acc, item) => {
      if (!acc.includes(item)) {
         acc.push(item);
      }
      return acc;
   }, []);


   if (uniqueArray.length - 1 < 0) {
      nights = 0;
   } else {
      nights = uniqueArray.length - 1
   }

   let price = (nights * rentPrice) + (saunas * saunaPrice);

   if (price < 0) price = 0;


   document.getElementById("price").value = price
}



renderCalendar();