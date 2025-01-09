import { Controller, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import Categoria from './interfaces/categorias/categoria.interface';

const ackErrors: string[] = ['E11000'];

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  logger = new Logger(AppController.name);

  @EventPattern('criar-categoria')
  async criarCategoria(
    @Payload() categoria: Categoria,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    this.logger.log(`categoria: ${JSON.stringify(categoria)}`);

    try {
      await this.appService.criarCategoria(categoria);
      await channel.ack(originalMsg);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      ackErrors.map(async (ackErrors) => {
        if (error.message.includes(ackErrors)) {
          await channel.ack(originalMsg);
        }
      });
    }
  }

  @MessagePattern('consultar-categorias')
  async consultarCategorias(
    @Payload() _id: string | null,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      if (_id && _id.trim() !== '') {
        this.logger.log(`Consultando categoria pelo ID: ${_id}`);
        return await this.appService.consultarCategoriaPeloId(_id);
      } else {
        this.logger.log(`Consultando todas as categorias`);
        return await this.appService.consultarTodasCategorias();
      }
    } finally {
      await channel.ack(originalMsg);
    }
  }

  @EventPattern('atualizar-categoria')
  async atualizarCategoria(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    this.logger.log(`data ${JSON.stringify(data)}`);

    try {
      const _id: string = data._id;
      const categoria: Categoria = data.categoria;
      await this.appService.atualizarCategoria(_id, categoria);
      await channel.ack(originalMsg);
    } catch (error) {
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError) {
        await channel.ack(originalMsg);
      }
    }
  }
}
