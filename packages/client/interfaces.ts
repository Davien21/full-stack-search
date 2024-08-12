interface IResponse<T = null> {
  message: string;
  data: T;
  success: boolean;
}

export interface ISuccessResponse<T> extends IResponse<T> {}

export interface IErrorResponse extends IResponse {}

export interface IHotel {
  _id: string;
  hotel_name: string;
  country: string;
}

export interface ICountry {
  _id: string;
  country: string;
}

export interface ICity {
  _id: string;
  name: string;
}

export interface ISearchData {
  hotels: IHotel[];
  countries: ICountry[];
  cities: ICity[];
}