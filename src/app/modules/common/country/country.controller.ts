// Libraries
import { Controller, UseBefore, Get, Param, Res } from "routing-controllers";
import { Response } from "express";

// Services
import { CountryService } from './country.service';
import { AuthMiddleware } from "../../../core/middlewares/auth.middleware";

@Controller('/country')
export class CountryController {
  constructor(private readonly _service: CountryService) { }

  /**
   * @author Jainam Shah
   * @description Get countries list
   */
  @Get('/list')
  async getCountries(@Res() res: Response) {
    const data = await this._service.getCountries();
    return res.send(data);
  }

  /**
   * @author Jainam Shah
   * @description Get states list from country_id
   * @param country_id
   */
  @UseBefore(AuthMiddleware)
  @Get('/:id([0-9]+)/states')
  async getStatesByCountry(@Param("id") id: number, @Res() res: Response) {
    const data = await this._service.getStatesByCountry(id);
    return res.send(data);
  }

}