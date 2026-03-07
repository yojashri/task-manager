import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UseGuards
} from '@nestjs/common'
import { CreateTaskDto } from './dto/create-task.dto'
import { TasksService } from './tasks.service'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { UpdateTaskDto } from './dto/update-task.dto'

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getTasks(@Req() req) {
    return this.tasksService.getTasks(req.user)
  }

  
@UseGuards(JwtAuthGuard)
@Post()
createTask(@Req() req, @Body() data) {
  return this.tasksService.createTask(req.user, data)
}
  @UseGuards(JwtAuthGuard)
  @Put(':id')
@UseGuards(JwtAuthGuard)
updateTask(
  @Param('id') id: string,
  @Req() req,
  @Body() body: UpdateTaskDto
) {
  return this.tasksService.updateTask(id, req.user, body)
}

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteTask(@Param('id') id: string, @Req() req) {
    return this.tasksService.deleteTask(id, req.user)
  }
}