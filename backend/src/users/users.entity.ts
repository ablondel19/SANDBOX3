import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { MatchHistoryDto } from './users.dto';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { GraphQLUpload } from 'graphql-upload-minimal';
@ObjectType()
@Entity()
export class User extends BaseEntity{
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  public id: number;

  @Field()
  @Column({ unique: true })
  public login: string;

  @Field()
  @Column()
  private _password: string;

  get password(): string {
    return this._password;
  }

  set password(value: string) {
    this._password = value;
  }

  @Field()
  @Column({ unique: true })
  phoneNumber: string;

  @Field()
  @Column({ default: 'offline' })
  public status: string;

  @Field(() => [String])
  @Column('text', { array: true, nullable: true })
  blackList: string[];

  @Field(() => [String])
  @Column('text', { array: true, nullable: true })
  friendList: string[];

  @Field(() => [MatchHistoryDto])
  @Column('jsonb', { nullable: true })
  matchHistory: MatchHistoryDto[];

  @Field()
  @Column({ default: 0 })
  nVictories: number;

  @Field()
  @Column({ default: 'default.jpg' })
  filename: string;

  @Field(()=>GraphQLUpload)
  @Column({
    type: 'bytea',
  })
  avatar: Uint8Array;
}