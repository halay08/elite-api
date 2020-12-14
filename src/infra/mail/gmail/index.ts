import * as nodemailer from 'nodemailer';
import * as smtpTransport from 'nodemailer-smtp-transport';
import * as Email from 'email-templates';
import * as path from 'path';

export const transporter = nodemailer.createTransport(
    smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: 'mail.elite.work@gmail.com',
            pass: '3lite.work'
        }
    })
);

const mailer = new Email({
    message: {
        from: 'mail.elite.work@gmail.com'
    },
    // uncomment below to send emails in development/test env:
    // send: true,
    transport: transporter
});

export const sendMail = async ({ template, message, locals }: { template: any; message: any; locals: any }) => {
    try {
        return await mailer.send({
            template: path.join(__dirname, 'templates', template),
            message,
            locals
        });
    } catch (error) {
        throw new Error(error.message);
    }
};
