export interface IResponse {
  error: boolean;
  errorCode: string;
  errorDescription: string;
  data: any;
}

export interface ITestResponse
{
  id: string;
  name: string;
  age: string;
  city: string;
}
