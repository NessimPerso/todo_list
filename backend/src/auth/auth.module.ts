import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
    useFactory: () => ({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '1d' },
  }),
}),
     TypeOrmModule.forFeature([User]),  // Import the User entity for TypeORM
  ],
  providers: [AuthService,JwtStrategy],
  controllers: [AuthController],
  exports: [JwtModule, AuthService], 
})
export class AuthModule {}