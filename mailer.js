const nodemailer = require('nodemailer')



const sendMail = async (receipient, subject, body) => {

    try {
      
        let transporter = nodemailer.createTransport({
            host: "smtp.mail.ru",
            port: 465,
            secure: true,
            auth: {
            user: process.env.MAIL_LOGIN, 
            pass: process.env.MAIL_PASSWORD, 
            },
        });
    
        // send mail with defined transport object
        let info = await transporter.sendMail({

            from: `"Студсовет Академии" <${process.env.MAIL_LOGIN}>`, 
            to: receipient, 
            subject: subject, 
            html: body

        });
    
        return({
            messageSent: true, 
        })

    } catch (error) {
        console.log(error.response)
        console.log()

        return({
            messageSent: false, 
        })
    }
  
    
}

module.exports = {sendMail}
  