const nodemailer = require('nodemailer')
const dotenv = require('dotenv')

dotenv.config()
const mailSender = async(Option)=>{
    
    const transporter = nodemailer.createTransport({
      service:process.env.service,
      auth:{
        user:process.env.user,
        pass:process.env.password,
        secure:false
        }

    });

    let mailoption = {
      from:process.env.user,
    to:Option.email, 
      subject:Option.subject,
      text:Option.message,
  }

  await transporter.sendMail(mailoption)
}

module.exports = mailSender