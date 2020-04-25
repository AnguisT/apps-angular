import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {AddTaskDialog} from '../../../../dialogs/add-task/add-task.dialog';
import {ProjectsService} from '../../projects/projects.service';
import {ActivatedRoute} from '@angular/router';
import {Subject} from 'rxjs';
import {pluck, switchMap, takeUntil} from 'rxjs/operators';
import {Projects, Message, IColumn, ITask} from '../task.models';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import {TaskService} from '../task.service';

@Component({
  selector: 'task-board',
  templateUrl: 'task-board.view.html',
  styleUrls: ['task-board.view.css'],
})
export class TaskBoardView implements OnInit, OnDestroy {
  project: Message;
  addColumnBtnDisabled = false;
  taskBoardIds = [];
  columns: IColumn[] = [];
  employees = [];
  imgurl: string;

  private selectedColumn: IColumn;
  private destroy$ = new Subject();

  constructor(
    private _matDialog: MatDialog,
    private _activatedRoute: ActivatedRoute,
    private _projectService: ProjectsService,
    private _taskService: TaskService,
  ) {}

  ngOnInit(): void {
    this._getRouteParam();
    this._getTasks();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  addTaskDialog(column: IColumn, task?: ITask) {
    this.selectedColumn = column;
    const dialogRef = this._matDialog.open(AddTaskDialog, {
      disableClose: true,
      width: '700px',
      data: task ? {task, project: this.project} : {project: this.project},
    });

    dialogRef.beforeClose().subscribe((res) => {
      debugger;
      if (res && res.id) {
        this._updateTask(res);
      }
      if (res && res.deleteId) {
        this._deleteTask(res.deleteId);
      }
      if (res && res.doneId) {
        this._done(res.doneId);
      }
    });
  }

  addColumn() {
    this.addColumnBtnDisabled = true;
    this.columns.push({
      id: Math.random().toString(36).substr(2, 9),
      title: '',
      tasks: [],
      edit: true,
    });
  }

  saveColumnStatus(column: IColumn) {
    this.addColumnBtnDisabled = false;
    column.edit = false;

    this.onSave();
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }

    this.onSave();
  }

  setTaskBoardId(id: any) {
    const newId = 'dropList-' + id;
    this.taskBoardIds.push(newId);
    return newId;
  }

  onSave() {
    const data = {
      ProjectId: this.project.Id,
      Boards: this.columns,
    };

    this._taskService
      .saveBoard(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe(console.log);
  }

  deleteColumn(column) {
    this._taskService.deleteColumn(column.id).subscribe((data) => {
      this._getRouteParam();
      this._getTasks();
    });
  }

  private _deleteTask(id: string) {
    const taskIndex = this.selectedColumn.tasks.findIndex(
      (item) => item.id === id,
    );
    this.selectedColumn.tasks.splice(taskIndex, 1);

    this.onSave();
  }

  private _done(id: string) {
    const taskIndex = this.selectedColumn.tasks.findIndex(
      (item) => item.id === id,
    );

    if (taskIndex !== -1) {
      const doneTask = this.selectedColumn.tasks.splice(taskIndex, 1);
      const findColumn = this.columns.find((item) => item.id === 16);

      findColumn.tasks.push(...doneTask);
      this.onSave();
    }
  }

  private _getRouteParam() {
    this._activatedRoute.params
      .pipe(
        takeUntil(this.destroy$),
        pluck('id'),
        switchMap((param) => this._getProject(param)),
      )
      .subscribe((res: Projects) => {
        if (res && res.message) {
          this.project = res.message[0];
          console.log(this.project);
        }
      });
  }

  private _getProject(id) {
    return this._projectService.getProjectById(id);
  }

  private _updateTask(task: ITask) {
    if (!this.selectedColumn) {
      return false;
    }

    const findTaskIndex = this.selectedColumn.tasks.findIndex(
      (item) => item.id === task.id,
    );

    if (findTaskIndex === -1) {
      this.selectedColumn.tasks.push(task);
    } else {
      this.selectedColumn.tasks[findTaskIndex] = task;
    }

    this.onSave();
  }

  private _getTasks() {
    this._activatedRoute.params
      .pipe(
        takeUntil(this.destroy$),
        pluck('id'),
        switchMap((param) => this._taskService.getBoard(param)),
      )
      .subscribe((res: IColumn[]) => {
        this.columns = res;
        this._projectService.getAllEmployee().subscribe((data) => {
          this.employees = data['message'];
          this.columns.forEach((column) => {
            column.tasks.forEach((task) => {
              const find = this.employees.find(
                (employee) => employee.Id === task.executor,
              );
              if (find) {
                task[
                  'imageExecutor'
                ] = `https://crm.i-s-group.ru:3000/static/${find.Image}`;
              }
            });
          });
        });
      });
  }
}
