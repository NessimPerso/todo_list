import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { TaskList } from '../entities/task-list.entity';
import { Task } from '../entities/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, TaskList, Task])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class TasksModule {}