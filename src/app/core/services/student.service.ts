import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { IMutateStudent, IStudent } from '@/app/shared/interfaces/student.interfaces';
import { IResponse } from '@/app/shared/interfaces/api.interfaces';
import { CREATE_STUDENT_ENDPOINT, GET_STUDENT_LIST_ENDPOINT, UPDATE_STUDENT_ENDPOINT } from '@/app/shared/constants/endpoint';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private httpService: HttpService) { }


  async getStudentList(): Promise<IStudent[]> {
    const response = await this.httpService.get<IResponse>(GET_STUDENT_LIST_ENDPOINT, {});
    return response?.data;
  }

  async createStudent(data: IMutateStudent): Promise<IResponse> {
    return this.httpService.post<IResponse>(CREATE_STUDENT_ENDPOINT, data);
  }

  async updateStudent(id: any, data: IMutateStudent): Promise<IResponse> {
    return this.httpService.put<IResponse>(UPDATE_STUDENT_ENDPOINT, id, data);
  }
}
