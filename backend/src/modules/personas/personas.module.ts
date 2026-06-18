import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Persona } from './entities/persona.entity';
import { PersonasService } from './personas.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Persona]),
  ],
  providers: [PersonasService],
  exports: [PersonasService],
})
export class PersonasModule {}