import { Body, Controller, Get, Post, Put, Query, Param, Sse } from '@nestjs/common';
import { RfidService } from './rfid.service';

@Controller('rfid')
export class RfidController {
    constructor(private rfidService: RfidService) {}

    @Get('/')
    async getAllCard() {
        return this.rfidService.getAllRFID();
    }

    @Put('/:rfid')
    async updateCardByRFID(@Param('rfid') params) {
        return this.rfidService.updateByRFID(params);
    }

    @Post('/')
    async postNewCard(@Query() params) {
        return this.rfidService.postRFID(params);
    }

    @Put('/') 
    async updateStatus(@Body() body) {
        return this.rfidService.updateStatus(body);
    }

    @Sse('/realtime')
    async realtimeData() {
        return this.rfidService.realtimeData();
    }
}
