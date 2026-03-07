import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class TasksService {

  constructor(private prisma: PrismaService) {}

 async getTasks(user: any) {

  if (user.role === "teacher") {

    const students = await this.prisma.user.findMany({
      where: { teacherId: user.userId }
    })

    const studentIds = students.map(s => s.id)

    return this.prisma.task.findMany({
      where: {
        OR: [
          { userId: user.userId },
          { userId: { in: studentIds } }
        ]
      }
    })
  }

  return this.prisma.task.findMany({
    where: { userId: user.userId }
  })
}
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

  async updateTask(id: string, user: any, body: any) {
    return this.prisma.task.update({
      where: { id },
      data: body
    })
  }

  async deleteTask(id: string, user: any) {
    return this.prisma.task.delete({
      where: { id }
    })
  }

}