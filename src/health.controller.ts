import { Controller, Get } from '@nestjs/common';

@Controller()
export default class HealthController {
  @Get('/')
  public home() {
    return { status_code: 200, message: 'Welcome to Hospyta Backend Endpoint' };
  }

  @Get('api')
  public api() {
    return { status_code: 200, message: 'Welcome to Hospyta Backend Endpoint' };
  }

  @Get('api/v1')
  public v1() {
    return {
      status_code: 200,
      message: 'Welcome to version 1 of Hospyta Backend Endpoint',
    };
  }

  @Get('health')
  public health() {
    return { status_code: 200, message: 'This server is up and running!' };
  }
}
