jest.mock('../src/model/envios.model', () => {
  const MockEnvios = jest.fn();
  MockEnvios.find = jest.fn();
  MockEnvios.findOne = jest.fn();
  MockEnvios.findById = jest.fn();
  MockEnvios.findOneAndUpdate = jest.fn();
  MockEnvios.findByIdAndDelete = jest.fn();
  return MockEnvios;
});

const { EnviosController } = require('../src/controller/envios.controller');
const Envios = require('../src/model/envios.model');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

beforeEach(() => {
  jest.clearAllMocks();
});

// ─── getAll ───────────────────────────────────────────────────────────────────
describe('getAll', () => {
  it('devuelve 200 con lista de envíos', async () => {
    const fakeData = [{ orderId: 1 }, { orderId: 2 }];
    Envios.find.mockReturnValue({ sort: jest.fn().mockResolvedValue(fakeData) });

    const res = mockRes();
    await EnviosController.getAll({}, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeData);
  });

  it('devuelve 500 si falla la DB', async () => {
    Envios.find.mockReturnValue({ sort: jest.fn().mockRejectedValue(new Error('DB error')) });

    const res = mockRes();
    await EnviosController.getAll({}, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─── getByOrderId ─────────────────────────────────────────────────────────────
describe('getByOrderId', () => {
  it('devuelve 400 si orderId no es número', async () => {
    const res = mockRes();
    await EnviosController.getByOrderId({ params: { orderId: 'abc' } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('devuelve 404 si no existe el envío', async () => {
    Envios.findOne.mockResolvedValue(null);
    const res = mockRes();
    await EnviosController.getByOrderId({ params: { orderId: '99' } }, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('devuelve 200 con el envío encontrado', async () => {
    const fakeEnvio = { orderId: 5, recipientName: 'Test' };
    Envios.findOne.mockResolvedValue(fakeEnvio);
    const res = mockRes();
    await EnviosController.getByOrderId({ params: { orderId: '5' } }, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeEnvio);
  });

  it('devuelve 500 ante error inesperado', async () => {
    Envios.findOne.mockRejectedValue(new Error('fail'));
    const res = mockRes();
    await EnviosController.getByOrderId({ params: { orderId: '5' } }, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─── getByShippingId ──────────────────────────────────────────────────────────
describe('getByShippingId', () => {
  it('devuelve 200 con el envío por _id', async () => {
    const fakeEnvio = { _id: '507f1f77bcf86cd799439011', orderId: 1 };
    Envios.findById.mockResolvedValue(fakeEnvio);
    const res = mockRes();
    await EnviosController.getByShippingId({ params: { id: '507f1f77bcf86cd799439011' } }, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('devuelve 404 si no existe', async () => {
    Envios.findById.mockResolvedValue(null);
    const res = mockRes();
    await EnviosController.getByShippingId({ params: { id: '507f1f77bcf86cd799439011' } }, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('devuelve 400 en CastError (ID inválido)', async () => {
    const err = new Error('cast');
    err.name = 'CastError';
    Envios.findById.mockRejectedValue(err);
    const res = mockRes();
    await EnviosController.getByShippingId({ params: { id: 'bad-id' } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('devuelve 500 ante error genérico', async () => {
    Envios.findById.mockRejectedValue(new Error('fail'));
    const res = mockRes();
    await EnviosController.getByShippingId({ params: { id: '507f1f77bcf86cd799439011' } }, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─── create ───────────────────────────────────────────────────────────────────
const validOrder = {
  id: 1,
  items: [{ quantity: 3 }, { quantity: 2 }],
  createdAt: '2026-06-15T00:00:00.000Z',
};
const validForm = {
  recipientName: 'Juan Pérez',
  shippingAddress: 'Av. Providencia 123',
  shippingDistrict: 'Providencia',
  shippingCity: 'Santiago',
};

describe('create', () => {
  it('devuelve 400 si falta el objeto order', async () => {
    const res = mockRes();
    await EnviosController.create({ body: { formManualData: validForm } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('devuelve 400 si faltan datos del formulario logístico', async () => {
    const res = mockRes();
    await EnviosController.create({ body: { order: validOrder } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('devuelve 201 al crear correctamente', async () => {
    const saved = { _id: '123', orderId: 1 };
    Envios.mockImplementation(() => ({ save: jest.fn().mockResolvedValue(saved) }));
    const res = mockRes();
    await EnviosController.create({ body: { order: validOrder, formManualData: validForm } }, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('devuelve 400 ante duplicado (código 11000)', async () => {
    const dupErr = new Error('dup');
    dupErr.code = 11000;
    Envios.mockImplementation(() => ({ save: jest.fn().mockRejectedValue(dupErr) }));
    const res = mockRes();
    await EnviosController.create({ body: { order: validOrder, formManualData: validForm } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('devuelve 500 ante error genérico en save', async () => {
    Envios.mockImplementation(() => ({ save: jest.fn().mockRejectedValue(new Error('fail')) }));
    const res = mockRes();
    await EnviosController.create({ body: { order: validOrder, formManualData: validForm } }, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─── updateStatus ─────────────────────────────────────────────────────────────
describe('updateStatus', () => {
  it('devuelve 400 si el estado es inválido', async () => {
    const res = mockRes();
    await EnviosController.updateStatus({ params: { orderId: '1' }, body: { status: 'ROTO' } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('devuelve 400 si falta el campo status', async () => {
    const res = mockRes();
    await EnviosController.updateStatus({ params: { orderId: '1' }, body: {} }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('devuelve 404 si no encuentra el envío para actualizar', async () => {
    Envios.findOneAndUpdate.mockResolvedValue(null);
    const res = mockRes();
    await EnviosController.updateStatus({ params: { orderId: '99' }, body: { status: 'DELIVERED' } }, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('devuelve 200 al actualizar correctamente', async () => {
    Envios.findOneAndUpdate.mockResolvedValue({ orderId: 1, shippingStatus: 'DELIVERED' });
    const res = mockRes();
    await EnviosController.updateStatus({ params: { orderId: '1' }, body: { status: 'DELIVERED' } }, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('devuelve 500 ante error en DB', async () => {
    Envios.findOneAndUpdate.mockRejectedValue(new Error('fail'));
    const res = mockRes();
    await EnviosController.updateStatus({ params: { orderId: '1' }, body: { status: 'IN_TRANSIT' } }, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─── destroy ──────────────────────────────────────────────────────────────────
describe('destroy', () => {
  it('devuelve 200 al eliminar correctamente', async () => {
    Envios.findByIdAndDelete.mockResolvedValue({ _id: '123' });
    const res = mockRes();
    await EnviosController.destroy({ params: { id: '507f1f77bcf86cd799439011' } }, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('devuelve 404 si no existe el envío', async () => {
    Envios.findByIdAndDelete.mockResolvedValue(null);
    const res = mockRes();
    await EnviosController.destroy({ params: { id: '507f1f77bcf86cd799439011' } }, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('devuelve 400 en CastError', async () => {
    const err = new Error('cast');
    err.name = 'CastError';
    Envios.findByIdAndDelete.mockRejectedValue(err);
    const res = mockRes();
    await EnviosController.destroy({ params: { id: 'bad-id' } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('devuelve 500 ante error genérico', async () => {
    Envios.findByIdAndDelete.mockRejectedValue(new Error('fail'));
    const res = mockRes();
    await EnviosController.destroy({ params: { id: '507f1f77bcf86cd799439011' } }, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
