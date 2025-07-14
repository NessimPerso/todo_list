import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { TaskList } from '../entities/task-list.entity';
import { Task } from '../entities/task.entity';
import { TaskService } from 'src/services/task.service';
import { TaskController } from 'src/controllers/task.controller';


@Module({
  imports: [TypeOrmModule.forFeature([User, TaskList, Task])],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TasksModule {}