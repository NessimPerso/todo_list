import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { TaskList } from '../entities/task-list.entity';
import { CreateTaskDto } from '../task/dto/create-task.dto';
import { UpdateTaskDto } from '../task/dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(TaskList)
    private taskListRepository: Repository<TaskList>,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: number): Promise<Task> {
    // Vérifier que la liste appartient à l'utilisateur
    const taskList = await this.taskListRepository.findOne({
      where: { 
        id: parseInt(createTaskDto.taskListId), 
        userId 
      },
    });

    if (!taskList) {
      throw new ForbiddenException('Liste de tâches non autorisée');
    }

    const task = this.taskRepository.create({
      ...createTaskDto,
      taskListId: parseInt(createTaskDto.taskListId), 
      dueDate: new Date(createTaskDto.dueDate),
    });

    return this.taskRepository.save(task);
  }

  async findAllByTaskList(taskListId: string, userId: number): Promise<Task[]> {
    // Vérifier que la liste appartient à l'utilisateur
    const taskList = await this.taskListRepository.findOne({
      where: { 
        id: parseInt(taskListId), 
        userId 
      },
    });

    if (!taskList) {
      throw new ForbiddenException('Liste de tâches non autorisée');
    }

    return this.taskRepository.find({
      where: { taskListId: parseInt(taskListId) }, 
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id: parseInt(id) }, 
      relations: ['taskList'],
    });

    if (!task) {
      throw new NotFoundException('Tâche introuvable');
    }

    // Vérifier que la tâche appartient à l'utilisateur
    if (task.taskList.userId !== userId) {
      throw new ForbiddenException('Tâche non autorisée');
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: number): Promise<Task> {
    const task = await this.findOne(id, userId);

    if (updateTaskDto.dueDate) {
      updateTaskDto.dueDate = new Date(updateTaskDto.dueDate) as any;
    }

    Object.assign(task, updateTaskDto);
    return this.taskRepository.save(task);
  }

  async remove(id: string, userId: number): Promise<void> {
    const task = await this.findOne(id, userId);
    await this.taskRepository.remove(task);
  }

  async toggleCompleted(id: string, userId: number): Promise<Task> {
    const task = await this.findOne(id, userId);
    task.completed = !task.completed;
    return this.taskRepository.save(task);
  }
}