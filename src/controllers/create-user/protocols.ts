import { User } from '../../models/user';
import { HttpRequest, HttpResponse } from '../protocols';

export interface IUpdateUserController {
  handle(httpRequest: HttpRequest<any>): Promise<HttpResponse<User>>;
}

export interface CreateUserParams {
  name: string;
  telephone: string;
  email: string;
}

export interface ICreateUserRepository {
  createUser(params: CreateUserParams): Promise<User>;
}
