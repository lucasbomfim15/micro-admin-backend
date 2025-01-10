import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { jogadorSchema } from './interfaces/jogador.schema';
import { JogadoresService } from './jogadores.service';
import { JogadoresController } from './jogadores.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Jogador', schema: jogadorSchema }]),
  ],
  providers: [JogadoresService],
  controllers: [JogadoresController],
  exports: [MongooseModule],
})
export class JogadoresModule {}
