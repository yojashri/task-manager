import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { StudentsService } from './students.service'

@UseGuards(JwtAuthGuard)
@Controller('students')
export class StudentsController {

  constructor(private studentsService: StudentsService) {}

  @Get()
  getStudents(@Req() req: any) {
    return this.studentsService.getStudentsForTeacher(req.user.id)
  }

}