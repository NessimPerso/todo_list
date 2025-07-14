import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TaskListService } from '../services/tasklist.service';
import { CreateTaskListDto } from '../tasklist/dto/create-tasklist.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateTaskListDto } from 'src/tasklist/dto/update-tasklist.dto';


@Controller('tasklists')
@UseGuards(JwtAuthGuard)
export class TaskListController {
  constructor(private readonly taskListService: TaskListService) {}

  @Post()
  create(@Body() createTaskListDto: CreateTaskListDto, @Request() req) {
    return this.taskListService.create(createTaskListDto, req.user.id);
  }

  @Get()
  findAll(@Request() req) {
    return this.taskListService.findAllByUser(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.taskListService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskListDto: UpdateTaskListDto,
    @Request() req,
  ) {
    return this.taskListService.update(id, updateTaskListDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.taskListService.remove(id, req.user.id);
  }
}