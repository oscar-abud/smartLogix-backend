import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import CircuitBreaker from 'opossum';

@Injectable()
export class CircuitBreakerService {
  private readonly logger = new Logger(CircuitBreakerService.name);

  // Método genérico para envolver cualquier llamada HTTP
  async runWithCircuitBreaker<T>(
    serviceName: string,
    action: () => Promise<T>,
    fallbackAction: () => Promise<T>,
  ): Promise<T> {
    
    // Configuración estándar para microservicios corporativos
    const options: CircuitBreaker.Options = {
      timeout: 3000,          // Si el microservicio tarda más de 3 segundos, cuenta como fallo
      errorThresholdPercentage: 50, // Abre el circuito si el 50% de las peticiones fallan
      resetTimeout: 10000,    // Espera 10 segundos en "Abierto" antes de pasar a "Semi-Abierto"
      volumeThreshold: 5,     // Número mínimo de peticiones antes de empezar a calcular el porcentaje
    };

    // Instanciamos el breaker envolviendo la acción asíncrona
    const breaker = new CircuitBreaker(action, options);

    // Configuramos la respuesta alternativa en caso de fallo o circuito abierto
    breaker.fallback(fallbackAction);

    // Listeners para monitorear la salud desde la consola de NestJS
    breaker.on('open', () => 
      this.logger.warn(`[CIRCUIT BREAKER OPEN] El microservicio [${serviceName}] está caído o inestable. Desviando tráfico a Fallback.`)
    );
    breaker.on('close', () => 
      this.logger.log(`[CIRCUIT BREAKER CLOSED] El microservicio [${serviceName}] se ha recuperado con éxito.`)
    );
    breaker.on('halfOpen', () => 
      this.logger.log(`[CIRCUIT BREAKER HALF-OPEN] Probando salud del microservicio [${serviceName}]...`)
    );

    try {
      // Ejecutamos la acción de forma segura
      return await breaker.fire();
    } catch (error: any) {
      this.logger.error(`Error procesado por el Breaker de ${serviceName}: ${error.message}`);
      throw new InternalServerErrorException(`Servicio temporalmente no disponible.`);
    }
  }
}