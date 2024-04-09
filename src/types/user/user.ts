import { Model, Types, Document } from 'mongoose';


export interface IUserProfileInput {
  avatar:string
  basicInformation: string;
  ghanaCard: string;
  driversLicense: string;
  driverPaymentDetails?:IDriverPaymentDetails
  vehicleDetails?:IDriverVehicleDetails
}

interface IDriverVehicleDetails {
  brand:string;
  model:string;
  numberPlate:string;
  additionalInformation:string
}
export interface IDriverPaymentDetails {
  accountNumber:string
  bankCode:string
}

export interface IUserSettings{
  userId:Types.ObjectId
  // General Settings
  language : 'EN' | 'FR' | 'ES' | 'DE' | 'ZH' | 'JA' | 'KO';
  theme: 'LIGHT' | 'DARK'
  notificationEnabled: boolean;
  soundEnabled: boolean;
  autoSaveInterval: number;
  
  // Privacy Settings
  profileVisibility: 'PUBLIC' | 'PRIVATE';
  contactInfoVisibility: 'PUBLIC' | 'PRIVATE';
  locationSharingEnabled: boolean;
  activityTrackingEnabled: boolean;
  dataSharingEnabled: boolean;
  dataRetentionPeriod: number; // in days

  // Security Settings
  twoFactorAuthEnabled: boolean;
  dataEncryptionEnabled: boolean;
  createdAt:Date
  updatedAt:Date
}

export interface IUserRating {
  userId: Types.ObjectId;
  ratedBy: Types.ObjectId;
  criteria: string;
  score: number;
  comment?: string;
}


// main user type
  export interface IUserProfile {
    avatar:string
    basicInformation: string;
  }
export interface IUser {
  firstname?: string;
  lastname?: string;
  othernames?: string;
  phoneNumber: string;
  email?: string;
  password?: string;
  type?: 'DRIVER' | 'PASSENGER';
  verificationCode: string;
  passwordResetCode?: string;
  verified: boolean;
  profile?: IUserProfile;
  settings?: IUserSettings;
  rating?: IUserRating[];
  longitude?: number;
  latitude?: number;
}

export interface IUserAuth {
  user: IUser;
}

export interface IUserInput {
  firstname: string;
  lastname: string;
  phoneNumber: string;
  email: string;
  password: string;
  type: 'DRIVER' | 'PASSENGER';
}

export interface IUserVerificationInput {
  id: Types.ObjectId;
  verificationCode: string;
}

export interface IUserResetPasswordInput {
  id: Types.ObjectId;
  passwordResetCode: string
  newPassword: string
}


export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
  validatePassword(password: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserModel extends Model<IUserDocument> {}
