import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AdminsModule } from './admins/admins.module';
import { ProfileModule } from './profile/profile.module';
import { ShopOwnersModule } from './shop-owners/shop-owners.module';
import { ShopsModule } from './shops/shops.module';
import { TerminalsModule } from './terminals/terminals.module';
import { RequestsModule } from './requests/requests.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    AdminsModule,
    ProfileModule,
    ShopOwnersModule,
    ShopsModule,
    TerminalsModule,
    RequestsModule,
  ],
})
export class AppModule {}