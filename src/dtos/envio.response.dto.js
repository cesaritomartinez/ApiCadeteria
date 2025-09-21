const buildEnvioDTOResponse = (envio) => {
  return {
    id: envio._id,
    user: envio.user,
    origen: envio.origen,
    destino: envio.destino,
    fechaRetiro: envio.fechaRetiro,
    horaRetiroAprox: envio.horaRetiroAprox,
    tamanoPaquete: envio.tamanoPaquete,
    notas: envio.notas,
    categoria: envio.categoria,
    estado: envio.estado,
    codigoSeguimiento: envio.codigoSeguimiento,
    fechaCreacion: envio.createdAt,
    fechaActualizacion: envio.updatedAt,
  };
};

module.exports = buildEnvioDTOResponse;
