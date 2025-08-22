import nodemailer from 'nodemailer'

interface SendEmailParams {
    to: string
    subject: string
    body: string
}

const transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: Number(process.env.NODEMAILER_PORT),
    secure: false,
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
    },
})

console.log(process.env.NODEMAILER_HOST)

export const sendMail = async ({ to, subject, body }: SendEmailParams) => {
    const mailOptions = {
        from: `"Urban-Drip" <${process.env.NODEMAILER_MAIL}>`,
        to,
        subject,
        html: body,
    }

    try {
        await transporter.sendMail(mailOptions)
        return { success: true }
    } catch (error) {
        let message = 'An unknown error occurred'
        if (error instanceof Error) {
            message = error.message
        }
        return { success: false, message }
    }
}
