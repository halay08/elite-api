import * as nodemailer from 'nodemailer';
import * as smtpTransport from 'nodemailer-smtp-transport';
import * as Email from 'email-templates';
import { env } from '@/api/http/config/constants';

const transporter = nodemailer.createTransport(
    smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: env.notification.email.vendors.gmail
    })
);

export const mailer = new Email({
    message: {
        from: env.notification.email.from
    },
    // uncomment below to send emails in development/test env:
    // send: true,
    transport: transporter
});
