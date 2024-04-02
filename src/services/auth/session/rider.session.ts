import { verifyJwt } from '../../../utils/token';
import { findSessionById, signAccessToken, signRefreshToken } from '../../../utils/session';

import IService, { IAppContext } from '../../../types/app';

export default class UserSessionService extends IService {
  constructor(props: IAppContext) {
    super(props);
  }
  // creates access tokens
  async createUserSession(req, res) {
    const id = req.body._id;
    const user = await this.models.Rider.findById(id);

    if (!user) {
      throw new Error('Invalid id or password');
    }

    const accessToken = await signAccessToken(user);

    const refreshToken = await signRefreshToken({ userId: user._id });

    return res.status(201).json({
      accessToken,
      refreshToken,
    });
  }

  // refreshes access tokens
  async refreshAccessToken(res, token) {
    const decoded = await verifyJwt<{ session: string }>(token);

    if (!decoded) {
      throw new Error('Could not refresh access token');
    }

    const session = await findSessionById(decoded.session);

    if (!session || !session.valid) {
      throw new Error('Could not refresh access token');
    }

    const user = await this.models.Rider.findById(String(session.userId));

    if (!user) {
      throw new Error('Could not refresh access token');
    }

    const accessToken = signAccessToken(user);

    return res.status(201).json({ accessToken });
  }
}
