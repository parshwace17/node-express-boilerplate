import { Response } from "express";
import { Controller, Get, Req, Body, Authorized, Res, Put, UseBefore } from "routing-controllers";

// Services
import { UserService } from './user.service';

// Validations
import { CHANGE_PASSWORD } from "./helpers/users.validator";
import { AuthMiddleware } from "../../core/middlewares/auth.middleware";

@Controller('/user')
@UseBefore(AuthMiddleware)
export class UserController {
    constructor(
        private readonly _service: UserService,
    ) { }

    /**
     * @author Jainam Shah
     * @description Get logged in user's information
     */
    @Get()
    @Authorized([2])
    async getUser(@Req() req: any, @Res() res: Response) {
        const data = await this._service.getUser(req.user.id);
        return res.send(data);
    }

    /**
     * @author Jainam Shah
     * @description Change logged in user's password
     */
    @Put('/change-password')
    @Authorized([2])
    async changePassword(
        @Req() req: any,
        @Body() body: CHANGE_PASSWORD,
        @Res() res: Response
    ) {
        const data = await this._service.changePassword(req.user.id, body);
        return res.send(data);
    }

}
