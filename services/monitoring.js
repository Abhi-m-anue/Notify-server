const Monitor = require("../models/monitors");
const nodeCron = require("node-cron");
const Axios = require("axios");
const nodemailer = require("nodemailer");

const sendEmailAlert = async (monitor) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD,
    },
  });
  const mailOptions = {
    from: {
      name: "Notify Team",
      address: process.env.USER_EMAIL,
    },
    to: monitor.alertEmail,
    subject: "Website down alert",
    text: `The URL ${monitor.url} is down!! Please take appropriate actions.
        -Notify team`,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(`send email alert to ${monitor.alertEmail}`);
  } catch (err) {
    console.log(`error sending email ${err}`);
  }
};

const task = async () => {
  const monitors = await Monitor.find({});
  if (monitors) {
    monitors.map(async (monitor) => {
      let attempts = 3;
      let success = false;
      for (let i = 0; i < attempts; i++) {
        try {
          const response = await Axios.get(monitor.url);
          if (response.status === 200) {
            success = true;
            break;
          } else {
            // console.log(
            //   `${new Date()} - ${monitor} is down. Attempt ${i + 1} failed`
            // );
          }
        } catch (err) {
          // console.log(
          //   `${new Date()} - ${monitor} is down. Attempt ${i + 1} failed`
          // );
        }
      }
      if (success) {
        monitor.status = "ok"; // to modify the lastUpdated parameter and update ok status whn a website comes back
      } else {
        if (monitor.status === "ok") {
          //only send email when previous status was ok and now down
          await sendEmailAlert(monitor);
          console.log(`${monitor.url} is down!! All ${attempts} attempts failed. `)
        }
        monitor.status = "down";
      }
      await monitor.save();
    });
  }
};

nodeCron.schedule("*/3 * * * *", task); // every 3 minutes
