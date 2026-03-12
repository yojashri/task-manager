import { ForbiddenException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { UpdateTaskDto } from './dto/update-task.dto'

@Injectable()
export class TasksService {

  constructor(private prisma: PrismaService) {}

  async getTasks(user: any, pagination: any) {

    const page = Number(pagination.page) || 1
    const limit = Number(pagination.limit) || 10
    const skip = (page - 1) * limit

    // ===============================
    // TEACHER: see own tasks + students tasks
    // ===============================
    if (user.role === "teacher") {

      const students = await this.prisma.user.findMany({
        where: { teacherId: user.id },   // ✅ FIXED
        select: { id: true }
      })

      const studentIds = students.map(s => s.id)

      const tasks = await this.prisma.task.findMany({
        where: {
          OR: [
            { userId: user.id },        // ✅ FIXED
            { userId: { in: studentIds } }
          ]
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      })

      const total = await this.prisma.task.count({
        where: {
          OR: [
            { userId: user.id },
            { userId: { in: studentIds } }
          ]
        }
      })

      return {
        tasks,
        total,
        page,
        limit
      }
    }

    // ===============================
    // STUDENT: see only own tasks
    // ===============================
    const tasks = await this.prisma.task.findMany({
      where: { userId: user.id },  // ✅ FIXED
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

  // ===============================
  // CREATE TASK
  // ===============================
  async createTask(user: any, data: any) {

    return this.prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        dueDate: new Date(data.dueDate),
        userId: user.id
      }
    })
  }

  // ===============================
  // UPDATE TASK
  // ===============================
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

  // ===============================
  // DELETE TASK
  // ===============================
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