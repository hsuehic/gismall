import { Service } from 'egg';
import { User, UserInfo } from 'firebase';


export default class AuthService extends Service {
  userToUserInfo = (user: User): UserInfo => {
    const { uid, email, photoURL, displayName, phoneNumber, providerId } = user;
    return {
      uid,
      email,
      phoneNumber,
      displayName,
      providerId,
      photoURL,
    };
  };
}
