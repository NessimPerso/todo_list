import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskList } from '../entities/task-list.entity';
import { CreateTaskListDto } from '../tasklist/dto/create-tasklist.dto';
import { UpdateTaskListDto } from '../tasklist/dto/update-tasklist.dto';

@Injectable()
export class TaskListService {
  constructor(
    @InjectRepository(TaskList)
    private taskListRepository: Repository<TaskList>,
  ) {}

  async create(createTaskListDto: CreateTaskListDto, userId: number): Promise<TaskList> {
    // Vérifier si une liste avec ce nom existe déjà pour cet utilisateur
    const existingTaskList = await this.taskListRepository.findOne({
      where: { name: createTaskListDto.name, userId },
    });

    if (existingTaskList) {
      throw new ForbiddenException('Une liste avec ce nom existe déjà');
    }

    const taskList = this.taskListRepository.create({
      ...createTaskListDto,
      userId,
    });

    return this.taskListRepository.save(taskList);
  }

  async findAllByUser(userId: number): Promise<TaskList[]> {
    return this.taskListRepository.find({
      where: { userId },
      relations: ['tasks'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: number): Promise<TaskList> {
    const taskList = await this.taskListRepository.findOne({
      where: { 
        id: parseInt(id), 
        userId 
      },
      relations: ['tasks'],
    });

    if (!taskList) {
      throw new NotFoundException('Liste de tâches introuvable');
    }

    return taskList;
  }

  async update(id: string, updateTaskListDto: UpdateTaskListDto, userId: number): Promise<TaskList> {
    const taskList = await this.findOne(id, userId);

    // Vérifier si le nouveau nom existe déjà (si changé)
    if (updateTaskListDto.name && updateTaskListDto.name !== taskList.name) {
      const existingTaskList = await this.taskListRepository.findOne({
        where: { name: updateTaskListDto.name, userId },
      });

      if (existingTaskList) {
        throw new ForbiddenException('Une liste avec ce nom existe déjà');
      }
    }

    Object.assign(taskList, updateTaskListDto);
    return this.taskListRepository.save(taskList);
  }

  async remove(id: string, userId: number): Promise<void> {
    const taskList = await this.findOne(id, userId);
    await this.taskListRepository.remove(taskList);
  }
}