import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Role } from "../base/entities/role.enum";
import { User } from "./entities/user.entity";

type CreateNewUserData = {
  username: string;
  email: string;
  password: string;
  salt: string;
}

@Injectable()
export class AuthService {
  constructor(
    private datasoure: DataSource,
  ) {}


  async createAdmin(userData: CreateNewUserData) {
    const user = this.datasoure.getRepository("users").create({
      username: userData.username,
      email: userData.email,
      password: userData.password,
      salt: userData.salt,
      role: Role.ADMIN
    });

    await this.datasoure.getRepository("users")
      .createQueryBuilder("user")
      .insert()
      .into("users")
      .values(user)
      .execute();
    
    return user;
  }

  findUserByUsernameOrEmail(searchData: {username?: string, email?: string}): Promise<User> {
    return this.datasoure.getRepository("users")
      .createQueryBuilder("user")
      .where("user.username = :username", {username: searchData.username})
      .orWhere("user.email = :email", {email: searchData.email})
      .getOne() as Promise<User>;
  }

  async createNewUser(userData: CreateNewUserData) {
    const user = this.datasoure.getRepository("users").create({
      username: userData.username,
      email: userData.email,
      password: userData.password,
      salt: userData.salt
    });

    await this.datasoure.getRepository("users")
      .createQueryBuilder("user")
      .insert()
      .into("users")
      .values(user)
      .execute();
    
    return user;
  }
}