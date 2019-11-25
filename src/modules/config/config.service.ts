import { Injectable, Global } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

@Injectable()
export class ConfigService {
  private readonly envConfig: Record<string, string>;

  constructor(filePath: string) {
    this.envConfig = dotenv.parse(fs.readFileSync(filePath))
  }

  get(key: string): string {
    return this.envConfig[key];
  }
  get jwtSecret(): string {
    return this.envConfig.JWT_SECRET;
  }
  get port() : number {
      return Number(this.envConfig.PORT)
  }
}
