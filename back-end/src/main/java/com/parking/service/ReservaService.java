package com.parking.service;

import java.util.List;
import java.util.Locale;
import java.util.NoSuchElementException;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.parking.dto.ReservaCreateDTO;
import com.parking.dto.ReservaEstadoDTO;
import com.parking.dto.ReservaResponseDTO;
import com.parking.entity.Espacio;
import com.parking.entity.EstadoEspacio;
import com.parking.entity.EstadoReserva;
import com.parking.entity.Reserva;
import com.parking.entity.TipoVehiculo;
import com.parking.entity.Usuario;
import com.parking.repository.EspacioRepository;
import com.parking.repository.EstadoEspacioRepository;
import com.parking.repository.EstadoReservaRepository;
import com.parking.repository.ReservaRepository;
import com.parking.repository.TipoVehiculoRepository;
import com.parking.repository.UsuarioRepository;

@Service
public class ReservaService {

    private static final String ESTADO_PENDIENTE = "PENDIENTE";
    private static final String ESTADO_ACTIVA = "ACTIVA";
    private static final String ESTADO_FINALIZADA = "FINALIZADA";
    private static final String ESTADO_CANCELADA = "CANCELADA";
    private static final String ESTADO_ESPACIO_LIBRE = "LIBRE";
    private static final String ESTADO_ESPACIO_RESERVADO = "RESERVADO";
    private static final String ESTADO_ESPACIO_OCUPADO = "OCUPADO";

    private final ReservaRepository reservaRepository;
    private final EstadoReservaRepository estadoReservaRepository;
    private final EspacioRepository espacioRepository;
    private final EstadoEspacioRepository estadoEspacioRepository;
    private final TipoVehiculoRepository tipoVehiculoRepository;
    private final UsuarioRepository usuarioRepository;

    public ReservaService(ReservaRepository reservaRepository,
            EstadoReservaRepository estadoReservaRepository,
            EspacioRepository espacioRepository,
            EstadoEspacioRepository estadoEspacioRepository,
            TipoVehiculoRepository tipoVehiculoRepository,
            UsuarioRepository usuarioRepository) {
        this.reservaRepository = reservaRepository;
        this.estadoReservaRepository = estadoReservaRepository;
        this.espacioRepository = espacioRepository;
        this.estadoEspacioRepository = estadoEspacioRepository;
        this.tipoVehiculoRepository = tipoVehiculoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional(readOnly = true)
    public List<ReservaResponseDTO> listarReservas() {
        return reservaRepository.findAllByOrderByFechaCreacionDesc()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public ReservaResponseDTO obtenerReservaPorCodigo(String codigoReserva) {
        Reserva reserva = reservaRepository.findByCodigoReserva(normalize(codigoReserva))
                .orElseThrow(() -> new NoSuchElementException("Reserva no encontrada"));
        return toDto(reserva);
    }

    @Transactional
    public ReservaResponseDTO crearReserva(ReservaCreateDTO dto) {

        if (!dto.getHoraFin().isAfter(dto.getHoraInicio())) {
            throw new IllegalArgumentException("La hora de fin debe ser mayor que la hora de inicio");
        }

        TipoVehiculo tipoVehiculo = tipoVehiculoRepository.findByNombreIgnoreCase(normalize(dto.getTipoVehiculo()))
                .orElseThrow(() -> new NoSuchElementException("Tipo de vehiculo no encontrado"));

        Espacio espacio = espacioRepository.findByIdAndActivoTrue(dto.getEspacioId())
                .orElseThrow(() -> new NoSuchElementException("Espacio no encontrado o inactivo"));

        if (!espacio.getTipoVehiculo().getId().equals(tipoVehiculo.getId())) {
            throw new IllegalArgumentException("El espacio no corresponde al tipo de vehiculo seleccionado");
        }

        String estadoEspacioActual = normalize(espacio.getEstado().getNombre()).toUpperCase(Locale.ROOT);
        if (!ESTADO_ESPACIO_LIBRE.equals(estadoEspacioActual)) {
            throw new IllegalStateException("Solo se puede reservar un espacio en estado LIBRE");
        }

        EstadoReserva estadoReserva = estadoReservaRepository.findByNombreIgnoreCase(ESTADO_PENDIENTE)
            .orElseThrow(() -> new NoSuchElementException("Estado de reserva PENDIENTE no encontrado"));

        EstadoEspacio estadoEspacioReservado = estadoEspacioRepository.findByNombreIgnoreCase(ESTADO_ESPACIO_RESERVADO)
                .orElseThrow(() -> new NoSuchElementException("Estado de espacio RESERVADO no encontrado"));

        Reserva reserva = new Reserva();
        reserva.setCodigoReserva(generarCodigoReserva());
        reserva.setPlaca(normalize(dto.getPlaca()).toUpperCase(Locale.ROOT));
        reserva.setTipoVehiculo(tipoVehiculo);
        reserva.setEspacio(espacio);
        reserva.setHoraInicio(dto.getHoraInicio());
        reserva.setHoraFin(dto.getHoraFin());
        reserva.setEstado(estadoReserva);
        reserva.setClienteNombreCompleto(normalize(dto.getClienteNombreCompleto()));
        reserva.setClienteTelefono(normalize(dto.getClienteTelefono()));
        reserva.setClienteEmail(normalize(dto.getClienteEmail()).toLowerCase(Locale.ROOT));
        reserva.setCreadoPor(obtenerUsuarioAutenticado());

        Reserva creada = reservaRepository.save(reserva);

        espacio.setEstado(estadoEspacioReservado);
        espacioRepository.save(espacio);

        return toDto(creada);
    }

    @Transactional
    public ReservaResponseDTO cambiarEstado(String codigoReserva, ReservaEstadoDTO dto) {
        Reserva reserva = reservaRepository.findByCodigoReserva(normalize(codigoReserva))
                .orElseThrow(() -> new NoSuchElementException("Reserva no encontrada"));

        String estadoActual = normalize(reserva.getEstado().getNombre()).toUpperCase(Locale.ROOT);
        String estadoNuevo = normalize(dto.getEstado()).toUpperCase(Locale.ROOT);

        validarCambioEstado(estadoActual, estadoNuevo);

        EstadoReserva nuevoEstado = estadoReservaRepository.findByNombreIgnoreCase(estadoNuevo)
                .orElseThrow(() -> new NoSuchElementException("Estado de reserva no encontrado"));

        reserva.setEstado(nuevoEstado);
        Reserva actualizada = reservaRepository.save(reserva);

        sincronizarEstadoEspacioPorReserva(actualizada);

        return toDto(actualizada);
    }

    private void sincronizarEstadoEspacioPorReserva(Reserva reserva) {
        String estadoReserva = normalize(reserva.getEstado().getNombre()).toUpperCase(Locale.ROOT);

        if (ESTADO_CANCELADA.equals(estadoReserva) || ESTADO_FINALIZADA.equals(estadoReserva)) {
            actualizarEstadoEspacio(reserva, ESTADO_ESPACIO_LIBRE);
            return;
        }

        if (ESTADO_PENDIENTE.equals(estadoReserva)) {
            actualizarEstadoEspacio(reserva, ESTADO_ESPACIO_RESERVADO);
            return;
        }

        if (ESTADO_ACTIVA.equals(estadoReserva)) {
            actualizarEstadoEspacio(reserva, ESTADO_ESPACIO_OCUPADO);
        }
    }

    private void actualizarEstadoEspacio(Reserva reserva, String estadoObjetivo) {
        EstadoEspacio estadoEspacio = estadoEspacioRepository.findByNombreIgnoreCase(estadoObjetivo)
                .orElseThrow(() -> new NoSuchElementException("Estado de espacio " + estadoObjetivo + " no encontrado"));
        reserva.getEspacio().setEstado(estadoEspacio);
        espacioRepository.save(reserva.getEspacio());
    }

    private void validarCambioEstado(String estadoActual, String estadoNuevo) {
        if (estadoActual.equals(estadoNuevo)) {
            return;
        }

        if (ESTADO_CANCELADA.equals(estadoActual) || ESTADO_FINALIZADA.equals(estadoActual)) {
            throw new IllegalStateException("No se puede cambiar una reserva que ya esta cerrada");
        }

        if (ESTADO_PENDIENTE.equals(estadoActual)) {
            if (ESTADO_ACTIVA.equals(estadoNuevo) || ESTADO_CANCELADA.equals(estadoNuevo)) {
                return;
            }
            throw new IllegalStateException("Una reserva PENDIENTE solo puede pasar a ACTIVA o CANCELADA");
        }

        if (ESTADO_ACTIVA.equals(estadoActual)) {
            if (ESTADO_FINALIZADA.equals(estadoNuevo) || ESTADO_CANCELADA.equals(estadoNuevo)) {
                return;
            }
            throw new IllegalStateException("Una reserva ACTIVA solo puede pasar a FINALIZADA o CANCELADA");
        }

        throw new IllegalStateException("Transicion de estado no soportada");
    }

    private String generarCodigoReserva() {
        return "R-" + System.currentTimeMillis();
    }

    private Usuario obtenerUsuarioAutenticado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            return null;
        }

        return usuarioRepository.findByUsernameAndActivoTrueAndEliminadoFalse(authentication.getName()).orElse(null);
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim();
    }

    private ReservaResponseDTO toDto(Reserva reserva) {
        return new ReservaResponseDTO(
                reserva.getId(),
                reserva.getCodigoReserva(),
                reserva.getPlaca(),
                reserva.getTipoVehiculo().getNombre(),
                reserva.getEspacio().getId(),
                reserva.getEspacio().getCodigoEspacio(),
                reserva.getEstado().getNombre(),
                reserva.getHoraInicio(),
                reserva.getHoraFin(),
                reserva.getClienteNombreCompleto(),
                reserva.getClienteTelefono(),
                reserva.getClienteEmail(),
                reserva.getFechaCreacion());
    }
}
