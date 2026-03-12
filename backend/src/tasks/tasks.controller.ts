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
  ParseUUIDPipe
} from '@nestjs/common'
import { PaginationDto } from 'src/common/dto/pagination.dto' 
import { CreateTaskDto } from './dto/create-task.dto'
import { UpdateTaskDto } from './dto/update-task.dto'
import { TasksService } from './tasks.service'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import {Query} from '@nestjs/common'
@Controller('tasks')
export class TasksController {

  constructor(private readonly tasksService: TasksService) {}



  // =========================
  // GET TASKS
  // =========================
  @UseGuards(JwtAuthGuard)
  @Get()
  getTasks(@Req() req, @Query() pagination: PaginationDto) {
    return this.tasksService.getTasks(req.user,pagination)
  }



  // =========================
  // CREATE TASK
  // =========================
  @UseGuards(JwtAuthGuard)
  @Post()
  createTask(
    @Req() req: any,
    @Body() dto: CreateTaskDto
  ) {
    return this.tasksService.createTask(req.user, dto)
  }



  // =========================
  // UPDATE TASK
  // =========================
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  updateTask(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: any,
    @Body() dto: UpdateTaskDto
  ) {
    return this.tasksService.updateTask(id, req.user, dto)
  }



  // =========================
  // DELETE TASK
  // =========================
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteTask(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: any
  ) {
    return this.tasksService.deleteTask(id, req.user)
  }

}