// src/__tests__/api.test.js

const request = require('supertest');
const app = require('../app');

// =========================================================
// PRUEBAS: Endpoint GET /api/productos
// =========================================================

describe('GET /api/productos', () => {
  test('Retorna lista de productos con status 200', async () => {
    const respuesta = await request(app).get('/api/productos');

    expect(respuesta.status).toBe(200);
    expect(respuesta.body.ok).toBe(true);
    expect(Array.isArray(respuesta.body.datos)).toBe(true);
    expect(respuesta.body.datos.length).toBeGreaterThan(0);
  });

  test('Cada producto tiene las propiedades requeridas', async () => {
    const respuesta = await request(app).get('/api/productos');

    const primer = respuesta.body.datos[0];

    expect(primer).toHaveProperty('id');
    expect(primer).toHaveProperty('nombre');
    expect(primer).toHaveProperty('precio');
  });
});

// =========================================================
// PRUEBAS: Endpoint POST /api/descuento
// =========================================================

describe('POST /api/descuento', () => {
  test('Calcula correctamente el descuento', async () => {
    const respuesta = await request(app)
      .post('/api/descuento')
      .send({ precio: 100, porcentaje: 20 });

    expect(respuesta.status).toBe(200);
    expect(respuesta.body.ok).toBe(true);
    expect(respuesta.body.precioFinal).toBe(80);
  });

  test('Retorna error 400 si faltan datos', async () => {
    const respuesta = await request(app)
      .post('/api/descuento')
      .send({ precio: 100 });

    expect(respuesta.status).toBe(400);
    expect(respuesta.body.ok).toBe(false);
  });

  test('Retorna error 400 con precio negativo', async () => {
    const respuesta = await request(app)
      .post('/api/descuento')
      .send({ precio: -50, porcentaje: 10 });

    expect(respuesta.status).toBe(400);
    expect(respuesta.body.error).toContain('negativo');
  });
});

// =========================================================
// PRUEBAS: Endpoint POST /api/validar-email
// =========================================================

describe('POST /api/validar-email', () => {
  test('Valida correctamente un email válido', async () => {
    const respuesta = await request(app)
      .post('/api/validar-email')
      .send({ email: 'usuario@ejemplo.com' });

    expect(respuesta.status).toBe(200);
    expect(respuesta.body.esValido).toBe(true);
  });

  test('Detecta un email inválido', async () => {
    const respuesta = await request(app)
      .post('/api/validar-email')
      .send({ email: 'no-es-email' });

    expect(respuesta.body.esValido).toBe(false);
  });

  test('Retorna 400 si no se envía email', async () => {
    const respuesta = await request(app)
      .post('/api/validar-email')
      .send({});

    expect(respuesta.status).toBe(400);
  });
});