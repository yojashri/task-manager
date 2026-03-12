// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { AuthModule } from './auth/auth.module';
// import { TasksModule } from './tasks/tasks.module';
// import { UsersModule } from './users/users.module';

// @Module({
//   imports: [AuthModule, TasksModule, UsersModule],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}
// import { Module } from '@nestjs/common'
// import { PrismaModule } from './prisma/prisma.module'

// @Module({
//   imports: [PrismaModule],
// })
// export class AppModule {}
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { TasksModule } from './tasks/tasks.module'
import { ThrottlerModule } from '@nestjs/throttler'
import { StudentsModule } from './students/students.module' 
@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minute
      limit: 10, // 10 requests per minute
    }]),
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    StudentsModule,
    TasksModule
  ],
})
export class AppModule {}

