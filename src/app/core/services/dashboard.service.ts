import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { IResponse } from '@/app/shared/interfaces/api.interfaces';
import { GET_VEHICLE_LIST_ENDPOINT } from '@/app/shared/constants/endpoint';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private httpService: HttpService) { }

  async fetchVehicleList() : Promise<IResponse> {
      const response = await this.httpService.get<IResponse>(GET_VEHICLE_LIST_ENDPOINT,{});
      return response;
  }

}
