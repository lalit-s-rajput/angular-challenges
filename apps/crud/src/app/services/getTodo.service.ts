import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TodoConfig } from '../core/Interface/todo';
import { randText } from '@ngneat/falso';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class GetToDoService {
  private getUrl = 'https://jsonplaceholder.typicode.com/todos';
  private updateUrl = 'https://jsonplaceholder.typicode.com/todos/';
  private deleteUrl = 'https://jsonplaceholder.typicode.com/todos/';
  private dataObservable = new BehaviorSubject<TodoConfig[]>([]);
  public isDataFetchRunning = new BehaviorSubject<boolean>(false);
  private headers = {
    'Content-type': 'application/json; charset=UTF-8',
  };

  constructor(private http: HttpClient) {}
  getTodoData() {
    this.turnOnSpinner();
    this.http.get<TodoConfig[]>(this.getUrl).subscribe((data: TodoConfig[]) => {
      this.dataObservable.next(data);
      this.turnOffSpinner();
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
        `${this.updateUrl}${todo.id}`,
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
      .subscribe((todoUpdated: TodoConfig) => {
        const newData = this.dataObservable.value.map((toDoObj: TodoConfig) => {
          if (toDoObj.id === todoUpdated.id) {
            return { ...toDoObj, title: todoUpdated.title };
          }
          return toDoObj;
        });
        this.turnOffSpinner();
        this.dataObservable.next(newData);
      });
    return this.dataObservable;
  }
  deleteTodo(id: number) {
    this.turnOnSpinner();
    this.http.delete(`${this.deleteUrl}${id}`).subscribe(() => {
      const newData = this.dataObservable.value.filter((item: TodoConfig) => {
        return id !== item.id;
      });
      this.turnOffSpinner();
      this.dataObservable.next(newData);
    });
    return this.dataObservable;
  }
}
