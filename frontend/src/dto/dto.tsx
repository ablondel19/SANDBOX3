import {
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsPhoneNumber,
    isString,
    IsString,
    MaxLength,
    MinLength,
    NotContains,
  } from 'class-validator';

export class MatchHistoryDto {
    @IsString()
    opponent: string;
  
    @IsInt()
    scoreX: number;
  
    @IsInt()
    scoreY: number;
  
    @IsString()
    map: string;
}
  
export class MatchResultDto {
  @IsInt()
  id: number;

  @IsString()
  Player1: string;

  @IsString()
  Player2: string;
  
  @IsInt()
  scoreX: number;

  @IsInt()
  scoreY: number;
}