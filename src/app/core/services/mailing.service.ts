import { Service } from 'typedi';
import * as nodemailer from 'nodemailer';
import * as mailerhbs from 'nodemailer-express-handlebars';
import { Config } from '../config';
// import { logger } from '../logger';

@Service()
export class MailingService {
  private transport: any;

  constructor(private readonly config: Config) {
    this.transport = nodemailer.createTransport({
      host: this.config.get('SMTP_HOST'),
      port: +this.config.get('SMTP_PORT'),
      secure: true,
      auth: {
        user: this.config.get('SMTP_USER'),
        pass: this.config.get('SMTP_PWD'),
      },
      debug: this.config.get('SMTP_DEBUG') === 'true',
      logger: this.config.get('SMTP_LOGGER') === 'true',
    }, {
      from: this.config.get('SMTP_FROM')
    });
  }

  public checkSMTP() {
    /* this.transport.verify((error: any) => {
      if (error) {
        logger.error('SMTP Error:', error);
        if (process.env.NODE_ENV === 'production') {
          process.exit(1);
        }
      } else {
        logger.info('SMTP Server is ready to send mail');
      }
    }); */
  }

  private async mail(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.transport.use('compile', mailerhbs({
        viewEngine: {
          extname: '.hbs',
          layoutsDir: 'src/templates/'
        },
        viewPath: 'src/templates/',
        extName: '.hbs',
      }));
      this.transport.sendMail(data, (err: any, res: any) => {
        if (err) {
          this.transport.close();
          reject(err);
        } else {
          this.transport.close();
          resolve(true);
        }
      });
    });
  }

  public sendMail(template: string, data: any, subject: string, to: string): Promise<any> {
    return this.mail({
      to,
      subject,
      template,
      context: data,
    });
  }

  public TEMPLATES = {
    OTP: 'otp',
    FORGOT_PASSWORD: 'forgot-password',
  }

  public SUBJECTS = {
    OTP: 'OTP',
    FORGOT_PASSWORD: 'Forgot Password',
  }

}