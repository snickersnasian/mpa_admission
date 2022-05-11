const { Router } = require('express')
const router = Router()
const Ticket = require('../models/Ticket')
const path = require('path') 
const QRCode = require('qrcode')
const { sendMail } = require('../mailer')


// /api/tickets/createTicket
router.post('/createTicket', async (req, res) => {
    try {


        const hostUrl = req.protocol + '://' + req.get('host')

        const year  = new Date().getFullYear()

        if (Object.keys(req.body).length !== 3) {
            return res.status(400).json({
                message: 'Error. Body not found or missed fields'
            })
        }

        let event = "Музыкальная премия академии"
         
        const { 
            firstName, 
            lastName, 
            mail,
        } = req.body

        const ticket = new Ticket({
            firstName: firstName,
            lastName: lastName,
            mail: mail,
            event: event,
            place: "РАНХиГС",
            time: "2022"
        })

        const response = await ticket.save()
        const ticketId = response.id

        const ticketUrl = `${hostUrl}/ticket/${ticketId}`

        const qr = await QRCode.toDataURL(ticketUrl)

        const mailBody = 
            `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="ticket.css">

                <style>
            @font-face {
            font-family: "Montserrat";
            src: url("https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");}
            </style>
                <title>Ticket</title>
            </head>
            <body>
            

                <div class="wrapper" style="width: 600px; height: 800px; background: url('https://i.postimg.cc/MHY8cq5k/hat.png') 0 0/100% auto no-repeat, #0C145A; display: flex; align-items: flex-end;">
                    <div class="ticket" style="height: 323px; font-family: 'Montserrat'; width: 600px; padding: 0 24px; color: #fff; display: flex; display: flex; justify-content: space-between; background: #0C145A;">
                        <div class="qr" style="height: 250px; min-width: 250px; margin: 10px 20px 0 0; background: red;">
                            <img src=${qr} style="height: 250px; min-width: 250px;" alt="">
                        </div>

                        <div class="ticket-info" style="display: flex; flex-direction: column; align-items: flex-end; width: 100%; height: 250px;">
                            <div class="event-text" style="text-transform: uppercase;">
                                
                                <p style="text-align: center; display: flex; flex-direction: column; margin-bottom: 70px; font-size: 18.6px;">
                                    Музыкальная 
                                    <span style="font-size: 14px;">премия Академии</span>
                                </p>
                                
                                <p>
                                    Event
                                </p>
                                
                            </div>
                            <div class="year" style="width: 100%; height: 100%; display: flex; align-items: flex-end;">
                                
                                <p style="margin: 0;">
                                    ${year}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
            </html>

            `

        const result = await sendMail(mail, "Регистрания на мероприятие: " + event, mailBody)

        if (!result.messageSent) {
            Ticket.findByIdAndDelete(ticketId)
            
            return res.status(400).json({
                message: "Can't create ticket."
            })
        }

        // res.status(200).json({
        //     message: 'Ticket created',
        //     ticketId: ticketId
        // })

        res.sendFile(path.join(__dirname, 'ticketCreated.html'))

    } catch (err) { 
        res.status(400).json({
            message: err.message
        })
    }
})


// /api/tickets/getTicket/:id
router.get('/getTicket/:id', async (req, res) => {
    try {


        

        
        console.log(req.params)

        const ticketId = req.params.id


        const ticket = await Ticket.findOne({_id: ticketId})

        

        res.sendFile(path.join(__dirname, 'validTicket.html'))

        // res.json({
        //     message: 'Ticket found.',
        //     ticket: ticket
        // })

    } catch (err) {
        res.json({
            message: err.message
        })
    }
})


module.exports = router