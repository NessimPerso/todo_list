import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskListService } from '../services/tasklist.service';
import { TaskListController } from '../controllers/tasklist.controller';
import { TaskList } from '../entities/task-list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskList])],
  controllers: [TaskListController],
  providers: [TaskListService],
  exports: [TaskListService],
})
export class TaskListModule {}
