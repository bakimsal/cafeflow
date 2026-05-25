import { Controller, Post, Get, Patch, Delete, Body, Param } from '@nestjs/common';
import { TablesService } from './tables.service';
import { CreateTableDto } from './dto/create-table.dto'; // <-- DTO'yu buraya çağırdık

@Controller('api/tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Post()
  async createTable(@Body() createTableDto: CreateTableDto) {
    // Artık dağınık body yerine, dışarıdan gelen temiz ve kurallı DTO paketini servise yolluyoruz
    return this.tablesService.createTable(createTableDto);
  }

  @Get('branch/:branchId')
  async getBranchTables(@Param('branchId') branchId: string) {
    return this.tablesService.getTablesByBranch(branchId);
  }

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