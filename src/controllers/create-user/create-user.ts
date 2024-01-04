import validator from 'validator';
import { User } from '../../models/user';
import { HttpRequest, HttpResponse, IController } from '../protocols';
import { CreateUserParams, ICreateUserRepository } from './protocols';
import { badRequest, created, serverError } from '../helpers';
import { MongoClient } from '../../database/mongo';
export class CreateUserController implements IController {
  constructor(private readonly createUserRepository: ICreateUserRepository) {}
  async handle(
    httpRequest: HttpRequest<CreateUserParams>,
  ): Promise<HttpResponse<User | string>> {
    try {
      const requiredFields = ['firstName', 'lastName', 'password', 'email'];

      for (const field of requiredFields) {
        if (!httpRequest?.body?.[field as keyof CreateUserParams]?.length) {
          return badRequest(`Field ${field} is required`);
        }
      }
      const email = httpRequest.body!.email;
      console.log('this is email', email);
      const emailIsValid = validator.isEmail(email);

      if (!emailIsValid) {
        return badRequest('E-mail is invalid');
      }
      const existingUser = await MongoClient.db
        .collection('users')
        .findOne({ email: httpRequest.body!.email });

      if (existingUser) {
        return badRequest('E-mail already exists');
      }

      const user = await this.createUserRepository.createUser(
        httpRequest.body!,
      );

      return created<User>(user);
    } catch (error) {
      return serverError();
    }
  }
}
