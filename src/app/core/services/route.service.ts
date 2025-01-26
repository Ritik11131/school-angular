import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { IRoute } from '@/app/shared/interfaces/route.interfaces';
import { IResponse } from '@/app/shared/interfaces/api.interfaces';
import { GET_ROUTE_LIST_ENDPOINT } from '@/app/shared/constants/endpoint';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  constructor(private httpService: HttpService) { }


  async getRoutesList(): Promise<IRoute[]> {
    const response = await this.httpService.get<IResponse>(GET_ROUTE_LIST_ENDPOINT, {});
    return response?.data;
  }
}
