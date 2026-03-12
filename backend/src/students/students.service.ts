import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class StudentsService {

  constructor(private prisma: PrismaService) {}

  async getStudentsForTeacher(teacherId: string) {

    return this.prisma.user.findMany({
      where: {
        teacherId: teacherId,
        role: 'student'
      },
      select: {
        id: true,
        email: true,
        createdAt: true
      }
    })

  }

}