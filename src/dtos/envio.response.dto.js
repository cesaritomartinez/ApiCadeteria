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
    category: envio.category,
    estado: envio.estado,
    codigoSeguimiento: envio.codigoSeguimiento,
    comprobantePagoUrl: envio.comprobantePagoUrl,
    fechaCreacion: envio.createdAt,
    fechaActualizacion: envio.updatedAt,
  };
};

module.exports = buildEnvioDTOResponse;
