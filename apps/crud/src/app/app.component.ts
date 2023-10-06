import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { TodoConfig } from './core/Interface/todo';
import { GetToDoService } from './services/getTodo.service';
import { Observable, of } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container">
      <div class="spinner" *ngIf="isShowSpinner | async; else showData">
        <mat-spinner></mat-spinner>
      </div>
      <ng-template #showData>
        <div class="show-view" *ngFor="let todo of todos | async">
          <div class="title-view">
            {{ todo.title }}
          </div>
          <div class="button-view">
            <button (click)="update(todo)">Update</button>
            <button class="delete" (click)="delete(todo.id)">Delete</button>
          </div>
        </div>
      </ng-template>
    </div>
  `,
  styles: [
    `
      html,
      body {
        height: 100vh;
      }
      .container {
        position: relative;
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      .show-view {
        border: 1px solid gray;
      }
      .title-view {
        text-align: center;
        font-size: 20px;
      }
      .button-view {
        display: flex;
        flex-direction: row;
        justify-content: center;
      }
      button {
        width: 80px;
        height: 30px;
        background-color: green;
        color: white;
        font-size: 20px;
        margin: 5px 10px;
      }
      .spinner {
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 50%;
        width: 100%;
        top: 50%;
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  todos!: Observable<TodoConfig[]>;
  isShowSpinner: Observable<boolean> = of(false);

  constructor(private getTodoService: GetToDoService) {}

  ngOnInit(): void {
    this.isShowSpinner = this.getTodoService.isDataFetchRunning;
    this.todos = this.getTodoService.getTodoData();
  }

  update(todo: TodoConfig) {
    this.todos = this.getTodoService.updateTodo(todo);
  }
  delete(id: number) {
    this.todos = this.getTodoService.deleteTodo(id);
  }
}
