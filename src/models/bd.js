const { getISODate } = require("../utils/date");

let userId = 1;
let envioId = 1;

const usuarios = [
  {
    id: userId++,
    username: "admin",
    password: "admin123",
    nombre: "Admin",
    apellido: "Principal",
    email: "admin@cadeteria.com",
    role: "admin",
    createdAt: "2025-09-06",
  },
  {
    id: userId++,
    username: "juanperez",
    nombre: "Juan",
    apellido: "Pérez",
    email: "juanperez@example.com",
    password: "1234",
    role: "cliente",
    plan: "plus",
    createdAt: "2025-09-06",
  },
  {
    id: userId++,
    username: "mariagomez",
    nombre: "María",
    apellido: "Gómez",
    email: "mariagomez@example.com",
    password: "abcd",
    role: "cliente",
    plan: "premium",
    createdAt: "2025-09-06",
  },
  {
    id: userId++,
    username: "pedrorodriguez",
    nombre: "Pedro",
    apellido: "Rodríguez",
    email: "pedrorodriguez@example.com",
    password: "pass",
    role: "cliente",
    plan: "plus",
    createdAt: "2025-09-06",
  },
  {
    id: userId++,
    username: "laurafernandez",
    nombre: "Laura",
    apellido: "Fernández",
    email: "laurafernandez@example.com",
    password: "laura",
    role: "cliente",
    plan: "premium",
    createdAt: "2025-09-06",
  },
  {
    id: userId++,
    username: "carloslopez",
    nombre: "Carlos",
    apellido: "López",
    email: "carloslopez@example.com",
    password: "carlos",
    role: "cliente",
    plan: "plus",
    createdAt: "2025-09-06",
  },
];

const envios = [
  {
    envioId: envioId++,
    userId: 2,
    origen: { calle: "Av. 18 de Julio", numero: 1234, ciudad: "Montevideo" },
    destino: { calle: "Colonia", numero: 567, ciudad: "Montevideo" },
    fechaRetiro: "2025-09-06",
    horaRetiroAprox: "12:00",
    tamanoPaquete: "chico",
    notas: "Sobre con documentación",
    categoria: {
      nombre: "Documentación",
      descripcion: "Papeles, sobres, contratos",
    }, // grande / chico / mediano
    estado: "pendiente",
  },
  {
    envioId: envioId++,
    userId: 2,
    origen: { calle: "Mercedes", numero: 2000, ciudad: "Montevideo" },
    destino: { calle: "Convención", numero: 455, ciudad: "Montevideo" },
    fechaRetiro: "2025-09-07",
    horaRetiroAprox: "09:30",
    tamanoPaquete: "mediano",
    notas: "Caja de zapatos",
    categoria: {
      nombre: "Urgente",
      descripcion: "Entregas con prioridad máxima",
    },
    estado: "en_ruta",
  },
  {
    envioId: envioId++,
    userId: 3,
    origen: { calle: "Rivera", numero: 300, ciudad: "Montevideo" },
    destino: { calle: "General Flores", numero: 1500, ciudad: "Montevideo" },
    fechaRetiro: "2025-09-08",
    horaRetiroAprox: "15:00",
    tamanoPaquete: "grande",
    notas: "Frasco de vidrio",
    categoria: {
      nombre: "Frágil",
      descripcion: "Frascos, vidrio, objetos delicados",
    },
    estado: "pendiente",
  },
  {
    envioId: envioId++,
    userId: 3,
    origen: { calle: "Maldonado", numero: 890, ciudad: "Montevideo" },
    destino: { calle: "Ejido", numero: 45, ciudad: "Montevideo" },
    fechaRetiro: "2025-09-06",
    horaRetiroAprox: "18:00",
    tamanoPaquete: "chico",
    notas: "Urgente para oficina",
    categoria: {
      nombre: "Urgente",
      descripcion: "Entregas con prioridad máxima",
    },
    estado: "pendiente",
  },
  {
    envioId: envioId++,
    userId: 3,
    origen: { calle: "Guayabos", numero: 678, ciudad: "Montevideo" },
    destino: { calle: "Soriano", numero: 789, ciudad: "Montevideo" },
    fechaRetiro: "2025-09-06",
    horaRetiroAprox: "14:00",
    tamanoPaquete: "mediano",
    notas: "Caja con libros",
    categoria: {
      nombre: "Documentación",
      descripcion: "Papeles, sobres, contratos",
    },
    estado: "entregado",
  },
  {
    envioId: envioId++,
    userId: 4,
    origen: { calle: "Canelones", numero: 1200, ciudad: "Montevideo" },
    destino: { calle: "Paysandú", numero: 980, ciudad: "Montevideo" },
    fechaRetiro: "2025-09-06",
    horaRetiroAprox: "16:00",
    tamanoPaquete: "grande",
    notas: "Muebles pequeños",
    categoria: {
      nombre: "Frágil",
      descripcion: "Frascos, vidrio, objetos delicados",
    },
    estado: "pendiente",
  },
  {
    envioId: envioId++,
    userId: 2,
    origen: { calle: "San José", numero: 1500, ciudad: "Montevideo" },
    destino: { calle: "Yi", numero: 333, ciudad: "Montevideo" },
    fechaRetiro: "2025-09-07",
    horaRetiroAprox: "11:00",
    tamanoPaquete: "chico",
    notas: "Entrega rápida",
    categoria: {
      nombre: "Urgente",
      descripcion: "Entregas con prioridad máxima",
    },
    estado: "pendiente",
  },
  {
    envioId: envioId++,
    userId: 3,
    origen: { calle: "18 de Julio", numero: 2200, ciudad: "Montevideo" },
    destino: { calle: "Gaboto", numero: 990, ciudad: "Montevideo" },
    fechaRetiro: "2025-09-09",
    horaRetiroAprox: "09:00",
    tamanoPaquete: "mediano",
    notas: "Paquete de ropa",
    categoria: {
      nombre: "Documentación",
      descripcion: "Papeles, sobres, contratos",
    },
    estado: "pendiente",
  },
  {
    envioId: envioId++,
    userId: 4,
    origen: { calle: "Bulevar Artigas", numero: 500, ciudad: "Montevideo" },
    destino: { calle: "Gonzalo Ramírez", numero: 1500, ciudad: "Montevideo" },
    fechaRetiro: "2025-09-10",
    horaRetiroAprox: "13:00",
    tamanoPaquete: "grande",
    notas: "Electrodoméstico pequeño",
    categoria: {
      nombre: "Frágil",
      descripcion: "Frascos, vidrio, objetos delicados",
    },
    estado: "pendiente",
  },
  {
    envioId: envioId++,
    userId: 2,
    origen: { calle: "Rivera", numero: 2500, ciudad: "Montevideo" },
    destino: {
      calle: "Luis Alberto de Herrera",
      numero: 1000,
      ciudad: "Montevideo",
    },
    fechaRetiro: "2025-09-11",
    horaRetiroAprox: "17:00",
    tamanoPaquete: "mediano",
    notas: "Pedido estándar",
    categoria: {
      nombre: "Documentación",
      descripcion: "Papeles, sobres, contratos",
    },
    estado: "pendiente",
  },
];

// metodos de la base de datos
//find
//si no encuentro el todo, devuelve: undefined
const findEnvioById = (id) =>
  envios.find((envio) => envio.envioId === Number(id));

//delete todo by id
const deleteEnvioById = (id) => {
  //findIndex( true/false )
  const indexToDelete = envios.findIndex(
    (envio) => envio.envioId === Number(id)
  );

  if (indexToDelete === -1) {
    return false;
  }

  //splice(indice, 1)
  envios.splice(indexToDelete, 1);
  return true;
};

//create new todo
const createEnvio = (
  userId,
  origen,
  destino,
  fechaRetiro,
  horaRetiroAprox,
  tamanoPaquete,
  notas,
  categoria
) => {
  const newEnvio = {
    envioId: envios.length > 0 ? envios[envios.length - 1].envioId + 1 : 1,
    userId,
    origen,
    destino,
    fechaRetiro,
    horaRetiroAprox: horaRetiroAprox || "Sin especificar",
    tamanoPaquete,
    notas: notas || "",
    categoria: categoria || { nombre: "General", descripcion: "Envio general" },
    estado: "pendiente",
    creadoEn: getISODate(),
  };

  envios.push(newEnvio);
  return newEnvio;
};

const updateEnvio = (id, completed) => {
  const indexToUpdate = envios.findIndex(
    (envio) => envio.envioId === Number(id)
  );

  if (indexToUpdate === -1) {
    return null;
  }

  //ACTUALIZAR LO NECESARIO DEL ENVIO ACA
  envios[indexToUpdate].completed = completed;
  return envios[indexToUpdate];
};

module.exports = {
  envios,
  usuarios,
  createEnvio,
  findEnvioById,
  deleteEnvioById,
  updateEnvio,
};
