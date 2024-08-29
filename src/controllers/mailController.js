const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const otpGenerator = require("otp-generator");
require("dotenv").config();

let config = {
    service : 'gmail',
    auth : {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_KEY
    }
}

let transporter = nodemailer.createTransport(config);

let MailGenerator = new Mailgen({
    theme: "default",
    product : {
        name: "Mailgen",
        link : 'https://mailgen.js/'
    }
})

const registerMail = async (req, res ) => {
    let { email, name } = req.body;
    email = email.toLowerCase();
    name = name.charAt(0).toUpperCase() + name.slice(1);

    let response = {
        body: {
            name,
            intro: "Your 6 Digit OTP Code!",
            table : {
                data: [
                    {
                        key: "OTP",
                        value: req.app.locals.OTP
                    }
                ]
              },
            outro: "Thank You!"
        }
    }

    let mail = MailGenerator.generate(response)

    let message = {
        from : process.env.MY_EMAIL,
        to : email,
        subject: "OTP Verification",
        html: mail
    }

    transporter.sendMail(message).then(() => {
        return res.status(201).json({
            msg: "you should receive an email"
        })
    }).catch(error => {
        return res.status(500).json({ error })
    })
}

const generateOTP = (req, res) => {
    try {
      req.app.locals.OTP = otpGenerator.generate(6, { lowerCaseAlphabets: false, specialChars: false, upperCaseAlphabets: false });
      res.status(200).json({ ok: true, message: `OTP Generated` });
    } catch (error) {
      res.status(400).json({ error: error.message, ok: false });
    }
  }
  
const verifyOTP = (req, res) => {
    const { codeOTP: code } = req.body;
    try {
      if (parseInt(req.app.locals.OTP) === parseInt(code)) {
        req.app.locals.OTP = null;
        res.status(200).json({ ok: true, message: `OTP Verified` });
      } else {
        res.status(400).json({ ok: false, message: `Invalid OTP` });
      }
    } catch (error) {
      res.status(400).json({ error: error.message, ok: false });
    }
  }

module.exports = { registerMail, generateOTP, verifyOTP }