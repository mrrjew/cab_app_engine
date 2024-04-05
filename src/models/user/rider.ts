import { Schema, model, CallbackError } from 'mongoose';
import { IUserDocument } from '../../types/user/user';
import code from 'otp-generator'
import bcrypt from 'bcrypt';

export const privateField = ['password', '__v', 'verificationCode', 'passwordResetCode', 'verified'];

const riderSchema = new Schema<IUserDocument>(
  {
    firstname: { type: String },
    lastname: { type: String },
    othernames: { type: String },
    email: { type: String },
    phoneNumber: { type: String, required: true },
    password: { type: String },
    verificationCode: {
      type: String,
      required: true,
      default: () => code.generate(4, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false }),
    },
    passwordResetCode: { type: String },
    verified: { type: Boolean, required: true, default: false },
    profile: {
      avatar: { type: String },
      basicInformation: { type: String },
    },
    settings: {
      // General Settings
      language: { type: String, enum: ['EN', 'FR', 'ES', 'DE', 'ZH', 'JA', 'KO'], default: 'EN' },
      theme: { type: String, enum: ['LIGHT', 'DARK'], default: 'LIGHT' },
      notificationEnabled: { type: Boolean, default: true },
      soundEnabled: { type: Boolean, default: true },
      autoSaveInterval: { type: Number, default: 10 },

      // Privacy Settings
      profileVisibility: { type: String, enum: ['PUBLIC', 'PRIVATE'], default: 'PUBLIC' },
      contactInfoVisibility: { type: String, enum: ['PUBLIC', 'PRIVATE'], default: 'PUBLIC' },
      locationSharingEnabled: { type: Boolean, default: true },
      activityTrackingEnabled: { type: Boolean, default: true },
      dataSharingEnabled: { type: Boolean, default: true },
      dataRetentionPeriod: { type: Number, default: 365 },

      // Security Settings
      twoFactorAuthEnabled: { type: Boolean, default: false },
      dataEncryptionEnabled: { type: Boolean, default: false },
    },
    latitude: { type: Number, required: false },
    longitude: { type: Number, required: false }
  },
  {
    timestamps: true,
  }
);

riderSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  } catch (err) {
    next(err as CallbackError);
  }
});

riderSchema.methods.validatePassword = async function (pass: string) {
  try {
    const _password = await bcrypt.compare(pass, this.password);
    console.log(pass,this.password,_password  )
    return _password;
  } catch (e) {
    throw new Error(`error validating password: ${e}`);
  }
};

const Rider = model('Driver', riderSchema);

export default Rider;
