package com.parking.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Locale;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.parking.dto.SalidaCobroDTO;
import com.parking.dto.SalidaCobroResponseDTO;
import com.parking.dto.SalidaResumenDTO;
import com.parking.entity.Espacio;
import com.parking.entity.EstadoEspacio;
import com.parking.entity.EstadoReserva;
import com.parking.entity.EstadoTicket;
import com.parking.entity.Pago;
import com.parking.entity.Reserva;
import com.parking.entity.Tarifa;
import com.parking.entity.Ticket;
import com.parking.entity.Usuario;
import com.parking.repository.EspacioRepository;
import com.parking.repository.EstadoEspacioRepository;
import com.parking.repository.EstadoReservaRepository;
import com.parking.repository.EstadoTicketRepository;
import com.parking.repository.PagoRepository;
import com.parking.repository.ReservaRepository;
import com.parking.repository.TarifaRepository;
import com.parking.repository.TicketRepository;
import com.parking.repository.UsuarioRepository;

@Service
public class SalidaService {

    private static final String ESTADO_TICKET_ACTIVO = "ACTIVO";
    private static final String ESTADO_TICKET_CERRADO = "CERRADO";
    private static final String ESTADO_ESPACIO_LIBRE = "LIBRE";
    private static final String ESTADO_RESERVA_ACTIVA = "ACTIVA";
    private static final String ESTADO_RESERVA_FINALIZADA = "FINALIZADA";
    private static final String METODO_PAGO_EFECTIVO = "EFECTIVO";
    private static final String METODO_PAGO_TARJETA = "TARJETA";

    private final EspacioRepository espacioRepository;
    private final TicketRepository ticketRepository;
    private final TarifaRepository tarifaRepository;
    private final PagoRepository pagoRepository;
    private final EstadoTicketRepository estadoTicketRepository;
    private final EstadoEspacioRepository estadoEspacioRepository;
    private final ReservaRepository reservaRepository;
    private final EstadoReservaRepository estadoReservaRepository;
    private final UsuarioRepository usuarioRepository;

    public SalidaService(
            EspacioRepository espacioRepository,
            TicketRepository ticketRepository,
            TarifaRepository tarifaRepository,
            PagoRepository pagoRepository,
            EstadoTicketRepository estadoTicketRepository,
            EstadoEspacioRepository estadoEspacioRepository,
            ReservaRepository reservaRepository,
            EstadoReservaRepository estadoReservaRepository,
            UsuarioRepository usuarioRepository) {
        this.espacioRepository = espacioRepository;
        this.ticketRepository = ticketRepository;
        this.tarifaRepository = tarifaRepository;
        this.pagoRepository = pagoRepository;
        this.estadoTicketRepository = estadoTicketRepository;
        this.estadoEspacioRepository = estadoEspacioRepository;
        this.reservaRepository = reservaRepository;
        this.estadoReservaRepository = estadoReservaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional(readOnly = true)
    public SalidaResumenDTO obtenerResumen(Long espacioId) {
        Espacio espacio = espacioRepository.findByIdAndActivoTrue(espacioId)
                .orElseThrow(() -> new NoSuchElementException("Espacio no encontrado o inactivo"));

        Ticket ticket = obtenerTicketActivoPorEspacio(espacio.getId());
        ResumenCalculo calculo = calcularMonto(ticket, LocalDateTime.now());

        return new SalidaResumenDTO(
                espacio.getId(),
                espacio.getCodigoEspacio(),
                ticket.getCodigoTicket(),
                ticket.getPlaca(),
                ticket.getTipoVehiculo().getNombre(),
                ticket.getHoraEntrada(),
                calculo.minutosEstadia(),
                calculo.montoTotal());
    }

    @Transactional
    public SalidaCobroResponseDTO procesarCobro(SalidaCobroDTO dto) {
        Espacio espacio = espacioRepository.findByIdAndActivoTrue(dto.getEspacioId())
                .orElseThrow(() -> new NoSuchElementException("Espacio no encontrado o inactivo"));

        Ticket ticket = obtenerTicketActivoPorEspacio(espacio.getId());
        LocalDateTime horaSalida = LocalDateTime.now();
        ResumenCalculo calculo = calcularMonto(ticket, horaSalida);

        String metodoPago = normalize(dto.getMetodoPago()).toUpperCase(Locale.ROOT);
        if (!METODO_PAGO_EFECTIVO.equals(metodoPago) && !METODO_PAGO_TARJETA.equals(metodoPago)) {
            throw new IllegalArgumentException("Metodo de pago invalido. Use EFECTIVO o TARJETA");
        }

        BigDecimal montoRecibido = METODO_PAGO_EFECTIVO.equals(metodoPago)
                ? Optional.ofNullable(dto.getMontoRecibido()).orElse(BigDecimal.ZERO)
                : calculo.montoTotal();

        if (METODO_PAGO_EFECTIVO.equals(metodoPago) && montoRecibido.compareTo(calculo.montoTotal()) < 0) {
            throw new IllegalArgumentException("El monto recibido es insuficiente para procesar el cobro");
        }

        BigDecimal cambio = METODO_PAGO_EFECTIVO.equals(metodoPago)
                ? montoRecibido.subtract(calculo.montoTotal()).setScale(2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);

        EstadoTicket estadoCerrado = estadoTicketRepository.findByNombreIgnoreCase(ESTADO_TICKET_CERRADO)
                .orElseThrow(() -> new NoSuchElementException("Estado de ticket CERRADO no encontrado"));
        EstadoEspacio estadoLibre = estadoEspacioRepository.findByNombreIgnoreCase(ESTADO_ESPACIO_LIBRE)
                .orElseThrow(() -> new NoSuchElementException("Estado de espacio LIBRE no encontrado"));

        ticket.setHoraSalida(horaSalida);
        ticket.setMontoTotal(calculo.montoTotal());
        ticket.setEstado(estadoCerrado);
        Ticket ticketActualizado = ticketRepository.save(ticket);

        espacio.setEstado(estadoLibre);
        espacioRepository.save(espacio);

        finalizarReservaActivaSiAplica(espacio.getId(), ticketActualizado.getPlaca(), horaSalida);

        Pago pago = new Pago();
        pago.setTicket(ticketActualizado);
        pago.setMonto(calculo.montoTotal());
        pago.setHoraPago(horaSalida);
        pago.setProcesadoPor(obtenerUsuarioAutenticado());
        pagoRepository.save(pago);

        return new SalidaCobroResponseDTO(
                espacio.getId(),
                espacio.getCodigoEspacio(),
                ticketActualizado.getCodigoTicket(),
                ticketActualizado.getPlaca(),
                ticketActualizado.getTipoVehiculo().getNombre(),
                ticketActualizado.getHoraEntrada(),
                horaSalida,
                calculo.minutosEstadia(),
                calculo.montoTotal(),
                metodoPago,
                montoRecibido.setScale(2, RoundingMode.HALF_UP),
                cambio,
                ticketActualizado.getEstado().getNombre());
    }

    private void finalizarReservaActivaSiAplica(Long espacioId, String placa, LocalDateTime horaSalida) {
        Optional<Reserva> reservaActiva = reservaRepository
                .findTopByEspacioIdAndPlacaIgnoreCaseAndEstadoNombreIgnoreCaseOrderByHoraInicioDesc(
                        espacioId,
                        placa,
                        ESTADO_RESERVA_ACTIVA);

        if (reservaActiva.isEmpty()) {
            return;
        }

        EstadoReserva estadoFinalizada = estadoReservaRepository.findByNombreIgnoreCase(ESTADO_RESERVA_FINALIZADA)
                .orElseThrow(() -> new NoSuchElementException("Estado de reserva FINALIZADA no encontrado"));

        Reserva reserva = reservaActiva.get();
        reserva.setEstado(estadoFinalizada);
        reserva.setHoraFin(horaSalida);
        reservaRepository.save(reserva);
    }

    private Ticket obtenerTicketActivoPorEspacio(Long espacioId) {
        return ticketRepository
                .findTopByEspacioIdAndEstadoNombreIgnoreCaseOrderByHoraEntradaDesc(espacioId, ESTADO_TICKET_ACTIVO)
                .orElseThrow(() -> new NoSuchElementException("No existe ticket activo para el espacio seleccionado"));
    }

    private ResumenCalculo calcularMonto(Ticket ticket, LocalDateTime horaSalida) {
        Tarifa tarifa = tarifaRepository.findByTipoVehiculoNombreIgnoreCase(ticket.getTipoVehiculo().getNombre())
                .orElseThrow(() -> new NoSuchElementException("No hay tarifa configurada para el tipo de vehiculo"));

        long minutosEstadia = Math.max(0, Duration.between(ticket.getHoraEntrada(), horaSalida).toMinutes());
        long minutosTolerancia = Optional.ofNullable(tarifa.getMinutosTolerancia()).orElse(0);

        BigDecimal montoTotal;
        if (minutosEstadia <= minutosTolerancia) {
            montoTotal = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        } else {
            long minutosFacturables = Math.max(minutosEstadia, Optional.ofNullable(tarifa.getMinutosMinimo()).orElse(0));
            long fraccion = Math.max(1, Optional.ofNullable(tarifa.getMinutosFraccion()).orElse(1));
            long cantidadFracciones = (long) Math.ceil((double) minutosFacturables / fraccion);
            montoTotal = tarifa.getPrecioPorFraccion()
                    .multiply(BigDecimal.valueOf(cantidadFracciones))
                    .setScale(2, RoundingMode.HALF_UP);
        }

        return new ResumenCalculo(minutosEstadia, montoTotal);
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

    private record ResumenCalculo(long minutosEstadia, BigDecimal montoTotal) {
    }
}
