import IService, { IAppContext } from '../../types/app';
import sendSms from '../../utils/sms';
import log from '../../utils/log';
import otp from 'otp-generator';

export default class RiderService extends IService {
  constructor(context: IAppContext) {
    super(context);
  }

  // registers Rider
  async registerRider(req, res) {
    try {
      const { phoneNumber } = req.body;
      if (!phoneNumber) {
        res.status(422).send('no input was received');
      }
      const _Rider = await this.models.Rider.findOne({ phoneNumber });
      if (_Rider) throw new Error('Rider already exists');

      const Rider = new this.models.Rider({ phoneNumber });
      await Rider.save();

      await sendSms(
        phoneNumber,
        `This is your cab app verification code: ${Rider.verificationCode}. Thank you for signing up.`
      );

      return Rider;
    } catch (e) {
      res.status(500).send(`Error creating new Rider: ${e}`);
    }
  }

  //verifies Rider
  async verifyRider(req, res): Promise<boolean> {
    const { id, verificationCode } = req.body;
    if (!id || !verificationCode) {
      res.status(422).send('missing required fields');
    }
    try {
      // Find the Rider by Id
      const Rider = await this.authenticate_rider(id);
      // Check if the Rider is already verified
      if (Rider.verified) {
        res.status(500).send('Rider is already verified');
      }

      // Check if verificationCode matches
      if (Rider.verificationCode != verificationCode) {
        res.status(500).send('Invalid verification code');
      }

      // Set verified to true and save Rider
      Rider.verified = true;
      await Rider.save();

      return true;
    } catch (e) {
      res.status(500).send(`Error validating Rider: ${e}`);
    }
  }

  // sends password reset code to Rider's email
  async forgotPassword(req, res) {
    try {
      const { phoneNumber } = req.body;
      if (!phoneNumber) {
        res.status(422).send('no input received');
      }

      const Rider = await this.models.Rider.findOne({ phoneNumber });

      if (!Rider) {
        res.status(404).send('Rider not found');
      }

      if (!Rider.verified) {
        res.status(500).send('Rider is not verified');
      }

      const passwordResetCode = otp.generate(4, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });

      Rider.passwordResetCode = passwordResetCode;

      await Rider.save();

      await sendSms(phoneNumber, `This is your cab app password reset code:${Rider.passwordResetCode}`);

      log.debug(`Password reset code sent to ${Rider.phoneNumber}`);

      const message = 'password reset code sent';
      return message;
    } catch (e) {
      res.status(500).send(`error handing password reset: ${e}`);
    }
  }

  // resets Rider's password to new password from email
  async resetPassword(req, res) {
    try {
      const { id, passwordResetCode, newPassword } = req.body;

      if (!id || !passwordResetCode || !newPassword) {
        res.status(422).send('missing required fields');
      }

      const Rider = await this.authenticate_rider(id);

      if (!Rider || Rider.passwordResetCode !== passwordResetCode) {
        res.status(404).send('Could not reset password');
      }

      Rider.passwordResetCode = null;

      Rider.password = newPassword;

      await Rider.save();

      const message = 'Successfully updated password';
      return message;
    } catch (e) {
      res.status(500).send('error reseting password');
    }
  }

  // login Rider
  async loginRider(req, res) {
    const { phoneNumber, password } = req.body;
    if (!phoneNumber || !password) {
      res.status(500).send('missing required fields');
    }

    const Rider = await this.models.Rider.findOne({ phoneNumber });
    if (!Rider) {
      res.status(404).send('Rider not found');
    }

    try {
      const valid = await Rider.validatePassword(password);
      if (!valid) {
        res.status(500).send('password incorrect');
      }
    } catch (e) {
      res.status(500).send('error logging in');
    }

    return Rider;
  }

  // updates Rider details
  async updateRider(req, res) {
    try {
      const Rider = await this.authenticate_rider(req.user._id);

      await Rider.updateOne({ $set: { ...req.body } });

      await Rider.save();

      return Rider;
    } catch (e) {
      res.status(500).send(`Error updating Rider: ${e.message}`);
    }
  }

  // deletes Rider account
  async deleteRider(req, res) {
    const Rider = await this.authenticate_rider(req.user._id);
    if (!Rider) {
      res.status(404).send('Error deleting Rider');
    }

    try {
      await this.models.Rider.findByIdAndDelete(req.user._id);
      res.status(200).send(`Deleted Rider successfully`);
    } catch (e) {
      res.status(500).send(`Error deleting Rider`);
    }
  }
}
