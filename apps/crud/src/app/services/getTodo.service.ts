import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TodoConfig } from '../core/Interface/todo';
import { randText } from '@ngneat/falso';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class GetToDoService {
  private commonUrl = 'https://jsonplaceholder.typicode.com/todos';
  private dataObservable = new BehaviorSubject<TodoConfig[]>([]);
  public globalLoaderFlag = new BehaviorSubject<boolean>(false);
  public isDataFetchRunning = new BehaviorSubject<boolean>(false);
  public errorValue = '';
  private headers = {
    'Content-type': 'application/json; charset=UTF-8',
  };

  constructor(private http: HttpClient) {}
  getTodoData() {
    this.globalLoaderFlag.next(true);
    this.http.get<TodoConfig[]>(this.commonUrl).subscribe({
      next: (data: TodoConfig[]) => {
        this.dataObservable.next(data);
        this.globalLoaderFlag.next(false);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.info('complete');
      },
    });
    return this.dataObservable;
  }
  turnOnSpinner() {
    this.isDataFetchRunning.next(true);
  }
  turnOffSpinner() {
    this.isDataFetchRunning.next(false);
  }
  updateTodo(todo: TodoConfig) {
    this.turnOnSpinner();
    this.http
      .put<TodoConfig>(
        `${this.commonUrl}/${todo.id}`,
        JSON.stringify({
          todo: todo.id,
          title: randText(),
          body: todo.body,
          userId: todo.userId,
        }),
        {
          headers: this.headers,
        }
      )
      .subscribe({
        next: (todoUpdated) => {
          const newData = this.dataObservable.value.map(
            (toDoObj: TodoConfig) => {
              if (toDoObj.id === todoUpdated.id) {
                return { ...toDoObj, title: todoUpdated.title };
              }
              return toDoObj;
            }
          );
          this.turnOffSpinner();
          this.dataObservable.next(newData);
        },
        error: (err) => {
          console.error(err);
        },
        complete: () => {
          console.info('complete');
        },
      });
    return this.dataObservable;
  }
  deleteTodo(id: number) {
    this.turnOnSpinner();
    this.http.delete(`${this.commonUrl}/${id}`).subscribe({
      next: () => {
        const newData = this.dataObservable.value.filter((item: TodoConfig) => {
          return id !== item.id;
        });
        this.turnOffSpinner();
        this.dataObservable.next(newData);
      },
      error: (e) => {
        console.error(e);
      },
      complete: () => console.info('complete'),
    });
    return this.dataObservable;
  }
}
