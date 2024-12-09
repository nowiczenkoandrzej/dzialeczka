const cron = require('node-cron');
const Rent = require('../models/rentModel');
const emailService = require('../utils/emailService')
const rentStatus = require('../utils/rentStatus')

class ReservationReminder {
    constructor() {
        this.startScheduler();
    }

    async findUpcomingReservations() {
        const today = new Date();
        const formattedToday = formatDate(today);

        console.log(formattedToday);

        try {
            const reservations = await Rent.findByStartDate(formattedToday);
            console.log(reservations);
            return reservations;
        } catch (error) {
            console.error('Błąd podczas wyszukiwania rezerwacji:', error);
            return [];
        }
    }

    async sendReminderEmails(reservations) {
        for (const reservation of reservations) {

            const { email, phone_number, start_date, end_date, saunas, status, desc, price } = reservation;

            if (status === rentStatus.PAID) {
                const subject = "Przypomnienie o rezerwacji";
                const text = `Przypominamy, że dziś o 15:00 rozpoczyna się Twoja rezerwacja domu letniskowego. Należy wymeldować się ${end_date} do godziny 11:00, Adres: https://maps.app.goo.gl/n5qKx3iB12prFqP27 Życzymy miłej zabawy!`;

                emailService.sendEmail(email, subject, text);
            } else {
                console.log("nieoplacone")
            }
            
        }
    }
    startScheduler() {
    // Uruchamianie codziennie o godzinie 9:00 rano
    cron.schedule('0 9 * * *', async () => {
      try {
        console.log('Sprawdzanie rezerwacji na jutro...');
        const upcomingReservations = await this.findUpcomingReservations();
        
        if (upcomingReservations.length > 0) {
          await this.sendReminderEmails(upcomingReservations);
        }
      } catch (error) {
        console.error('Błąd podczas sprawdzania rezerwacji:', error);
      }
    });
  }
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

module.exports = new ReservationReminder();