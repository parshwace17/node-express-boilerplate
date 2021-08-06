import { Response } from "express";
import { Controller, Post, Body, Res, UseBefore, HeaderParam } from "routing-controllers";

// validations
import { SIGNUP, LOGIN } from './helpers/auth.validator';

// helpers
import { AuthService } from './auth.service';
import { encryptResonse } from '../../core/helper/response-handler';
import { DecryptorMiddleware } from "../../core/middlewares/decryptor.middleware";

@Controller('/auth')
@UseBefore(DecryptorMiddleware)
export class AuthController {

  constructor(private readonly _service: AuthService) { }

  /**
   * @author Parshwa Shah
   * @description User signup
   */
  @Post('/signup')
  async singup(
    @HeaderParam("device-id") deviceId: string,
    @Body() body: SIGNUP,
    @Res() res: Response
  ) {
    const data = await this._service.userSignup(body);
    return res.send({ 'payload': encryptResonse(data, deviceId) });
  }

  /**
   * @author Parshwa Shah
   * @description User login
   */
  @Post('/login')
  async login(
    @HeaderParam("device-id") deviceId: string,
    @Body() body: LOGIN,
    @Res() res: Response
  ) {
    const data = await this._service.userLogin(body, deviceId);
    // res.header('Authorization', `Bearer ${data.result.token}`);
    res.cookie('token', data.result.token);
    delete data.result.token;
    data.result.deviceId = deviceId;
    data.result.userData = encryptResonse(data.result, deviceId);
    return res.send({ 'payload': encryptResonse(data, deviceId) });
  }

  /**
   * @author Jainam Shah
   * @description Invalidate logged in user's token
   */
  @Post('/logout')
  async logout(@HeaderParam("device-id") deviceId: string, @Res() res: Response) {
    res.clearCookie('accessToken');
    const logout = { status: 200, message: 'Logout successfully' }
    return res.send({ 'payload': encryptResonse({ ...logout, success: true }, deviceId) });
  }

}