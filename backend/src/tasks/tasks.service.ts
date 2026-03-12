import { ForbiddenException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { UpdateTaskDto } from './dto/update-task.dto'

@Injectable()
export class TasksService {

  constructor(private prisma: PrismaService) {}

  // ===================================
  // GET MY TASKS (Teacher or Student)
  // ===================================
  async getMyTasks(user: any, pagination: any) {

    const page = Number(pagination.page) || 1
    const limit = Number(pagination.limit) || 10
    const skip = (page - 1) * limit

    const tasks = await this.prisma.task.findMany({
      where: { userId: user.id },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    })

    const total = await this.prisma.task.count({
      where: { userId: user.id }
    })

    return {
      tasks,
      total,
      page,
      limit
    }
  }


  // ===================================
  // GET TASKS OF A STUDENT (Teacher)
  // ===================================
  async getStudentTasks(user: any, studentId: string, pagination: any) {

    if (user.role !== 'teacher') {
      throw new ForbiddenException('Only teachers can view student tasks')
    }

    const page = Number(pagination.page) || 1
    const limit = Number(pagination.limit) || 10
    const skip = (page - 1) * limit

    const student = await this.prisma.user.findFirst({
      where: {
        id: studentId,
        teacherId: user.id
      }
    })

    if (!student) {
      throw new ForbiddenException('Student not assigned to this teacher')
    }

    const tasks = await this.prisma.task.findMany({
      where: { userId: studentId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    })

    const total = await this.prisma.task.count({
      where: { userId: studentId }
    })

    return {
      tasks,
      total,
      page,
      limit
    }
  }


  // ===================================
  // CREATE TASK
  // ===================================
  async createTask(user: any, data: any) {

    return this.prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        userId: user.id
      }
    })
  }


  // ===================================
  // UPDATE TASK
  // ===================================
  async updateTask(id: string, user: any, dto: UpdateTaskDto) {

    const task = await this.prisma.task.findUnique({
      where: { id }
    })

    if (!task || task.userId !== user.id) {
      throw new ForbiddenException('You cannot update this task')
    }

    return this.prisma.task.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        progress: dto.progress
      }
    })
  }


  // ===================================
  // DELETE TASK
  // ===================================
  async deleteTask(id: string, user: any) {

    const task = await this.prisma.task.findUnique({
      where: { id }
    })

    if (!task || task.userId !== user.id) {
      throw new ForbiddenException('You cannot delete this task')
    }

    return this.prisma.task.delete({
      where: { id }
    })
  }

}