const nodemailer = require('nodemailer');

exports.sendEmail = async (recipient, subject, text) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASS,
        },
    });

    const message = {
        from: {
            name: 'Działeczka',
            address: process.env.EMAIL_ADDRESS
        },
        to: recipient,
        subject: subject,
        text: text,
    };

    try {
        const info = await transporter.sendMail(message);
        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error(error);
        throw new Error("Błąd przy wysyłaniu maila.");
    }
};

exports.informAdmin = async (text) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASS,
        },
    });
    const message = {
        from: {
            name: 'Działeczka',
            address: process.env.EMAIL_ADDRESS
        },
        to: process.env.EMAIL_ADDRESS,
        subject: "Nowa Rezerwacja",
        text: text,
    };

    try {
        const info = await transporter.sendMail(message);
        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error(error);
        throw new Error("Błąd przy wysyłaniu maila.");
    }
}