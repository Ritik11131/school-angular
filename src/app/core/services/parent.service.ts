import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { IResponse } from '@/app/shared/interfaces/api.interfaces';
import { CREATE_PARENT_ENDPOINT, GET_PARENT_LIST_ENDPOINT } from '@/app/shared/constants/endpoint';
import { IMutateParent, IParent } from '@/app/shared/interfaces/parent.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ParentService {

  constructor(private httpService: HttpService) { }
  
  
    async getParentList(): Promise<IParent[]> {
      const response = await this.httpService.get<IResponse>(GET_PARENT_LIST_ENDPOINT, {});
      return response?.data;
    }
  
    async createParent(data: IMutateParent): Promise<IResponse> {
      return this.httpService.post<IResponse>(CREATE_PARENT_ENDPOINT, data);
    }
}
