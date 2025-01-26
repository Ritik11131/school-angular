import { IResponse } from '@/app/shared/interfaces/api.interfaces';
import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { CREATE_CREW_ENDPOINT, GET_CREW_LIST_ENDPOINT } from '@/app/shared/constants/endpoint';
import { ICrew, IMutateCrew } from '@/app/shared/interfaces/crew.interfaces';

@Injectable({
  providedIn: 'root'
})
export class CrewService {

  constructor(private httpService: HttpService) { }


  async getCrewList(): Promise<ICrew[]> {
    const response = await this.httpService.get<IResponse>(GET_CREW_LIST_ENDPOINT, {});
    return response?.data;
  }

  async createCrew(data: IMutateCrew): Promise<IResponse> {
    return this.httpService.post<IResponse>(CREATE_CREW_ENDPOINT, data, true);
  }
}
