import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './users.entity';
import {
  LeadeBoardDto,
  MatchHistoryDto,
  ProfileDto,
  SignDto,
  UserIdDto,
  UserRelationDto,
  UserResponseDto,
  loginDto,
  UserSignInDto,
} from 'src/users/users.dto';
import * as bcrypt from 'bcrypt';
import { readFileSync } from 'graceful-fs';
import * as path from 'path';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async displayAll() {
    console.log(`users.service: displayAll(userRepository)`);
    return await this.userRepository.find();
  }

  async clear() {
    console.log(`users.service: clear(userRepository)`);
    return await this.userRepository.clear();
  }

  async getByLogin(login: string): Promise<User | null> {
    console.log(`users.service: getByLogin(${login})`);
    const result = await this.userRepository.findOneBy({ login });
    if (result) return result;
    return null;
  }

  async uploadFile(
    id: number,
    buffer: Buffer,
    filename: string,
  ): Promise<UserIdDto | null> {
    console.log(`users.service: uploadFile(${id} -> ${filename})`);
    const user = await this.getById(id);
    if (user) {
      user.filename = filename;
      user.avatar = buffer;
      await this.userRepository.save(user).catch((err) => {
        return err;
      });
      return {
        id: user.id,
      };
    }
    return null;
  }

  async getById(id: number): Promise<User | null> {
    console.log(`users.service: getByid(${id})`);
    return await this.userRepository.findOneBy({ id });
  }

  async signUp(user: SignDto): Promise<any | null> {
    console.log(`users.service: signUp(${user})`);
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(user.password, salt);
    const reqBody = {
      login: user.login,
      _password: hash,
      phoneNumber: user.phoneNumber,
      avatar: readFileSync(path.resolve('src/users/default.jpg')),
      TFA: user.phoneNumber ? true : false,
    };
    const newUser = await this.userRepository.save(reqBody).catch((err) => {
      return [err.detail, err.code];
    });
    if (newUser) {
      return newUser;
    }
    return null;
  }

  async signIn(user: loginDto): Promise<UserSignInDto | null> {
    console.log(`users.service: signIn(${user})`);
    const { login } = user;
    const foundUser = await this.userRepository.findOneBy({ login });
    if (foundUser) {
      const { password } = foundUser;
      const result = bcrypt.compareSync(user.password, password);
      if (result) {
        foundUser.status = 'online';
        await this.userRepository.save(foundUser).catch((err) => {
          return err;
        });
        return {
          id: foundUser.id,
          login: foundUser.login,
          status: foundUser.status,
          TFA: foundUser.TFA,
          phoneNumber: foundUser.phoneNumber,
        };
      }
    }
    return null;
  }

  async addFriend(data: UserRelationDto): Promise<UserResponseDto | null> {
    console.log(`users.service: addFriend(${data.target})`);
    const user = await this.getById(data.id);
    if (user) {
      user.friendList.push(data.target);
      await this.userRepository.save(user).catch((err) => {
        return err;
      });
      return {
        id: user.id,
        login: user.login,
        status: user.status,
      };
    }
    return null;
  }

  async removeFriend(data: UserRelationDto): Promise<UserResponseDto | null> {
    console.log(`users.service: removeFriend(${data.target})`);
    const user = await this.getById(data.id);
    if (user) {
      user.friendList = user.friendList.filter((value) => {
        return value !== data.target;
      });
      await this.userRepository.save(user).catch((err) => {
        return err;
      });
      return {
        id: user.id,
        login: user.login,
        status: user.status,
      };
    }
    return null;
  }

  async addToMatchHistory(
    userData: UserIdDto,
    macthData: MatchHistoryDto,
  ): Promise<User | null> {
    console.log(`users.service: addToMatchHistory(${userData.id})`);
    const user = await this.getById(userData.id);
    if (user) {
      const newItem = new MatchHistoryDto();
      newItem.map = macthData.map;
      newItem.opponent = macthData.opponent;
      newItem.scoreX = macthData.scoreX;
      newItem.scoreY = macthData.scoreY;
      await this.userRepository.save(user).catch((err) => {
        return err;
      });
      return user;
    }
    return null;
  }

  async getMatchHistory(
    userData: UserIdDto,
  ): Promise<MatchHistoryDto[] | null> {
    console.log(`users.service: getMatchHistory(${userData.id})`);
    const user = await this.getById(userData.id);
    if (user) {
      return user.matchHistory;
    }
    return null;
  }

  async getLeaderboard(): Promise<(string | number)[][] | null> {
    const users = this.userRepository.find();
    if (users) {
      const sortedUsers = (await users).sort(
        (a, b) => b.nVictories - a.nVictories,
      );
      const leaderBoard = sortedUsers.map((user, index) => {
        return [user.login, user.nVictories, index + 1];
      });
      if (leaderBoard) return leaderBoard;
    }
    return null;
  }

  async getFriendList(friends: string[]): Promise<any> {
    if (friends) {
      const users = await this.userRepository.find({
        where: {
          login: In(friends),
        },
      });
      const friendList = users.map((user) => {
        const base64EncodedAvatar = Buffer.from(user.avatar).toString('base64');
        return {
          login: user.login,
          status: user.status,
          avatar: base64EncodedAvatar,
        };
      });
      if (friendList) return friendList;
    }
    return null;
  }

  async getProfile(userData: UserIdDto): Promise<ProfileDto | null> {
    const user = await this.getById(userData.id);
    if (user) {
      return {
        login: user.login,
        avatar: user.avatar,
        status: user.status,
      };
    }
    return null;
  }

  async updateLogin(user: User, newLogin: string): Promise<any> {
    if (user) {
      user.login = newLogin;
      const updatedLogin = await this.userRepository.save(user).catch((err) => {
        //console.log('ERROR: ', err);
        return err;
      });
      return user;
    }
    return null;
  }
}
