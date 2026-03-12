import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  ParseUUIDPipe,
  Query
} from '@nestjs/common'

import { PaginationDto } from 'src/common/dto/pagination.dto'
import { CreateTaskDto } from './dto/create-task.dto'
import { UpdateTaskDto } from './dto/update-task.dto'
import { TasksService } from './tasks.service'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'

@Controller('tasks')
export class TasksController {

  constructor(private readonly tasksService: TasksService) {}

  // ===================================
  // GET MY TASKS
  // ===================================
  @UseGuards(JwtAuthGuard)
  @Get('my')
  getMyTasks(
    @Req() req,
    @Query() pagination: PaginationDto
  ) {
    return this.tasksService.getMyTasks(req.user, pagination)
  }


  // ===================================
  // GET STUDENT TASKS (Teacher)
  // ===================================
  @UseGuards(JwtAuthGuard)
  @Get('student/:id')
  getStudentTasks(
    @Req() req,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query() pagination: PaginationDto
  ) {
    return this.tasksService.getStudentTasks(req.user, id, pagination)
  }


  // ===================================
  // CREATE TASK
  // ===================================
  @UseGuards(JwtAuthGuard)
  @Post()
  createTask(
    @Req() req: any,
    @Body() dto: CreateTaskDto
  ) {
    return this.tasksService.createTask(req.user, dto)
  }


  // ===================================
  // UPDATE TASK
  // ===================================
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  updateTask(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: any,
    @Body() dto: UpdateTaskDto
  ) {
    return this.tasksService.updateTask(id, req.user, dto)
  }


  // ===================================
  // DELETE TASK
  // ===================================
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteTask(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: any
  ) {
    return this.tasksService.deleteTask(id, req.user)
  }

}