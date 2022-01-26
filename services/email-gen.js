const MailGen = require('mailgen');

const {
  company: { name },
} = require('../helpers/constants');

require('dotenv').config();
const { NGROK_TUNNEL, BASE_URL } = process.env;

class SenderEmailService {
  constructor(env, sender) {
    switch (env) {
      case 'development':
        this.link = NGROK_TUNNEL;
        break;
      case 'production':
        this.link = BASE_URL;
        break;

      default:
        this.link = NGROK_TUNNEL;
        break;
    }
    this.sender = sender;
  }

  #createTemplateEmail(options) {
    const {
      greeting = 'Hi',
      signature = false,
      intro = `Welcome to ${name}`,
      table,
      userName = 'Friend',
      instructions = 'To started click here',
      btn = true,
      btnText = 'Click here',
      link,
    } = options;
    const mailGenerator = new MailGen({
      theme: 'salted',
      product: {
        name,
        link: this.link,
      },
    });
    const email = {
      body: {
        greeting,
        name: userName,
        signature,
        intro,
        table,
        action: {
          instructions,
          button: btn
            ? {
                color: '#22BC66',
                text: btnText,
                link: `${this.link}/${link}`,
              }
            : '',
        },
      },
    };

    const emailBody = mailGenerator.generate(email);
    return emailBody;
  }
  async sendEmail(email, options) {
    const { subject = 'Subject email' } = options;
    const emailBodyHtml = this.#createTemplateEmail(options);
    const emailToSend = {
      to: email,
      subject,
      html: emailBodyHtml,
    };

    const sendedEmail = await this.sender(emailToSend);
  }
}

module.exports = {
  SenderEmailService,
};
