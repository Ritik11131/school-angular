import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { IMutatePlan, IPlan } from '@/app/shared/interfaces/plans.interfaces';
import { IResponse } from '@/app/shared/interfaces/api.interfaces';
import { CREATE_PLAN_ENDPOINT, GET_PLAN_LIST_ENDPOINT, UPDATE_PLAN_ENDPOINT } from '@/app/shared/constants/endpoint';

@Injectable({
  providedIn: 'root'
})
export class PlansService {

  constructor(private httpService: HttpService) { }
  
  
    async getPlansList(): Promise<IPlan[]> {
      const response = await this.httpService.get<IResponse>(GET_PLAN_LIST_ENDPOINT, {});
      return response?.data;
    }
  
    async createPlan(data: IMutatePlan): Promise<IResponse> {
      return this.httpService.post<IResponse>(CREATE_PLAN_ENDPOINT, data);
    }

  async updateParent(id: any, data: IMutatePlan): Promise<IResponse> {
    return this.httpService.put<IResponse>(UPDATE_PLAN_ENDPOINT, id, data);
  }
}
