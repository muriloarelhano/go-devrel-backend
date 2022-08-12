import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Helpers")
@Controller()
export class AppController {

    @Get('/health')
    create() {
        return { status: 'OK' }
    }

}
