import { Controller, Post, Get, Patch, Delete, Body, Param } from '@nestjs/common';
import { TablesService } from './tables.service';

@Controller('api/tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Post()
  async createTable(@Body() body: { name: string; qrCode: string; branchId: string }) {
    return this.tablesService.createTable(body.name, body.qrCode, body.branchId);
  }

  @Get('branch/:branchId')
  async getBranchTables(@Param('branchId') branchId: string) {
    return this.tablesService.getTablesByBranch(branchId);
  }

  // --- YENİ EKLENEN KISIMLAR ---

  @Get(':id')
  async getTableById(@Param('id') id: string) {
    return this.tablesService.getTableById(id);
  }

  @Patch(':id')
  async updateTable(
    @Param('id') id: string,
    @Body() body: { name?: string; qrCode?: string; status?: any }
  ) {
    return this.tablesService.updateTable(id, body);
  }

  @Delete(':id')
  async deleteTable(@Param('id') id: string) {
    return this.tablesService.deleteTable(id);
  }
}