import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { IMutateRoute, IRoute } from '@/app/shared/interfaces/route.interfaces';
import { IResponse } from '@/app/shared/interfaces/api.interfaces';
import { CREATE_ROUTE_ENDPOINT, GET_ROUTE_BY_ID_ENDPOINT, GET_ROUTE_LIST_ENDPOINT } from '@/app/shared/constants/endpoint';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  constructor(private httpService: HttpService) { }


  async getRoutesList(): Promise<IRoute[]> {
    const response = await this.httpService.get<IResponse>(GET_ROUTE_LIST_ENDPOINT, {});
    return response?.data;
  }

  async getRouteById(id: number): Promise<IRoute> {
    const response = await this.httpService.get<IResponse>(GET_ROUTE_BY_ID_ENDPOINT, {}, id);
    return response?.data;
  }

  async createRoute(routeObject: IMutateRoute): Promise<IResponse> {
    const response = await this.httpService.post<IResponse>(CREATE_ROUTE_ENDPOINT, routeObject);
    return response;
  }
}
