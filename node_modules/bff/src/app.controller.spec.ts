import { CircuitBreakerService } from './common/circuit-breaker.service';

describe('CircuitBreakerService', () => {
  let service: CircuitBreakerService;

  beforeEach(() => {
    service = new CircuitBreakerService();
  });

  it('ejecuta la acción y retorna el resultado cuando el servicio responde', async () => {
    const result = await service.runWithCircuitBreaker(
      'TEST-SERVICE',
      async () => ({ data: 'ok' }),
      async () => ({ data: 'fallback' }),
    );
    expect(result).toEqual({ data: 'ok' });
  });

  it('invoca el fallback si la acción falla', async () => {
    const result = await service.runWithCircuitBreaker(
      'TEST-FAIL',
      async () => { throw new Error('servicio caído'); },
      async () => ({ data: 'fallback' }),
    );
    expect(result).toEqual({ data: 'fallback' });
  });
});
