package com.parking.service.reportes;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.temporal.WeekFields;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.parking.dto.ReporteSerieTemporalItemDTO;
import com.parking.dto.ReporteSerieTemporalResponseDTO;
import com.parking.dto.ReporteTablaFilaDTO;
import com.parking.dto.ReporteTablaResponseDTO;
import com.parking.entity.Ticket;
import com.parking.repository.TicketRepository;
import com.parking.service.reportes.common.ReportesCommonService;
import com.parking.service.reportes.common.ReportesCommonService.RangoFechas;

@Service
public class OperativosReportService {

    private static final String ESTADO_TICKET_ACTIVO = "ACTIVO";
    private static final String ESTADO_TICKET_ANULADO = "ANULADO";
    private static final int MAX_RANGE_DIAS = 92;

    private final TicketRepository ticketRepository;
    private final ReportesCommonService commonService;
    private final Clock appClock;

    public OperativosReportService(
            TicketRepository ticketRepository,
            ReportesCommonService commonService,
            Clock appClock) {
        this.ticketRepository = ticketRepository;
        this.commonService = commonService;
        this.appClock = appClock;
    }

    @Transactional(readOnly = true)
    public ReporteSerieTemporalResponseDTO obtenerEntradasPorHora(OffsetDateTime fechaDesde, OffsetDateTime fechaHasta, Long usuarioId, String tipoVehiculo) {
        return obtenerEntradasPorPeriodo(fechaDesde, fechaHasta, usuarioId, tipoVehiculo, "hora");
    }

    @Transactional(readOnly = true)
    public ReporteSerieTemporalResponseDTO obtenerEntradasPorPeriodo(OffsetDateTime fechaDesde, OffsetDateTime fechaHasta, Long usuarioId, String tipoVehiculo, String granularidad) {
        RangoFechas rango = commonService.resolverRango(fechaDesde, fechaHasta, MAX_RANGE_DIAS);
        String gran = normalizarGranularidad(granularidad);
        List<Ticket> tickets = filtrarPorUsuarioYTipo(
            ticketRepository.findAllByHoraEntradaGreaterThanEqualAndHoraEntradaLessThan(
                rango.fechaDesde(),
                rango.fechaHasta()),
            usuarioId,
            tipoVehiculo);

        return construirSeriePorPeriodo(tickets, Ticket::getHoraEntrada, gran, "Entradas por " + gran, "tickets");
    }

    @Transactional(readOnly = true)
    public ReporteSerieTemporalResponseDTO obtenerSalidasPorHora(OffsetDateTime fechaDesde, OffsetDateTime fechaHasta, Long usuarioId, String tipoVehiculo) {
        return obtenerSalidasPorPeriodo(fechaDesde, fechaHasta, usuarioId, tipoVehiculo, "hora");
    }

    @Transactional(readOnly = true)
    public ReporteSerieTemporalResponseDTO obtenerSalidasPorPeriodo(OffsetDateTime fechaDesde, OffsetDateTime fechaHasta, Long usuarioId, String tipoVehiculo, String granularidad) {
        RangoFechas rango = commonService.resolverRango(fechaDesde, fechaHasta, MAX_RANGE_DIAS);
        String gran = normalizarGranularidad(granularidad);
        List<Ticket> tickets = filtrarPorUsuarioYTipo(
            ticketRepository.findAllByHoraSalidaGreaterThanEqualAndHoraSalidaLessThan(
                rango.fechaDesde(),
                rango.fechaHasta()),
            usuarioId,
            tipoVehiculo);

        return construirSeriePorPeriodo(tickets, Ticket::getHoraSalida, gran, "Salidas por " + gran, "tickets");
    }

    @Transactional(readOnly = true)
    public ReporteTablaResponseDTO obtenerTicketsActivosActuales(Long usuarioId, String tipoVehiculo) {
        List<Ticket> activos = filtrarPorUsuarioYTipo(ticketRepository.findAll(), usuarioId, tipoVehiculo).stream()
                .filter(ticket -> ticket.getEstado() != null)
                .filter(ticket -> ESTADO_TICKET_ACTIVO.equalsIgnoreCase(ticket.getEstado().getNombre()))
                .sorted((a, b) -> {
                    LocalDateTime first = a.getHoraEntrada() == null ? LocalDateTime.MIN : a.getHoraEntrada();
                    LocalDateTime second = b.getHoraEntrada() == null ? LocalDateTime.MIN : b.getHoraEntrada();
                    return second.compareTo(first);
                })
                .toList();

        List<String> columnas = List.of("codigoTicket", "placa", "tipoVehiculo", "codigoEspacio", "usuario", "horaEntrada", "estado");
        List<ReporteTablaFilaDTO> filas = activos.stream()
                .map(ticket -> {
                    Map<String, String> row = new LinkedHashMap<>();
                    row.put("codigoTicket", ticket.getCodigoTicket());
                    row.put("placa", ticket.getPlaca());
                        row.put("tipoVehiculo", ticket.getTipoVehiculo() == null || ticket.getTipoVehiculo().getNombre() == null
                            ? "-"
                            : ticket.getTipoVehiculo().getNombre());
                    row.put("codigoEspacio", ticket.getEspacio().getCodigoEspacio());
                    row.put("usuario", obtenerEtiquetaUsuario(ticket));
                    row.put("horaEntrada", commonService.formatDateTime(ticket.getHoraEntrada()));
                    row.put("estado", ticket.getEstado().getNombre());
                    return new ReporteTablaFilaDTO(row);
                })
                .toList();

        return new ReporteTablaResponseDTO(
                "Tickets activos actuales",
                columnas,
                filas,
                (long) filas.size());
    }

    @Transactional(readOnly = true)
    public ReporteTablaResponseDTO obtenerEstadiasLargas(Integer umbralMinutos, Long usuarioId, String tipoVehiculo) {
        int umbral = umbralMinutos == null || umbralMinutos < 1 ? 360 : umbralMinutos;
        LocalDateTime now = LocalDateTime.now(appClock);

        List<Ticket> activos = filtrarPorUsuarioYTipo(ticketRepository.findAll(), usuarioId, tipoVehiculo).stream()
                .filter(ticket -> ticket.getEstado() != null)
                .filter(ticket -> ESTADO_TICKET_ACTIVO.equalsIgnoreCase(ticket.getEstado().getNombre()))
                .sorted((a, b) -> {
                    LocalDateTime first = a.getHoraEntrada() == null ? LocalDateTime.MIN : a.getHoraEntrada();
                    LocalDateTime second = b.getHoraEntrada() == null ? LocalDateTime.MIN : b.getHoraEntrada();
                    return second.compareTo(first);
                })
                .toList();

        List<String> columnas = List.of("codigoTicket", "placa", "codigoEspacio", "usuario", "horaEntrada", "minutosEstadia");
        List<ReporteTablaFilaDTO> filas = activos.stream()
                .filter(ticket -> ticket.getHoraEntrada() != null)
                .map(ticket -> {
                    long minutos = Duration.between(ticket.getHoraEntrada(), now).toMinutes();
                    Map<String, String> row = new LinkedHashMap<>();
                    row.put("codigoTicket", ticket.getCodigoTicket());
                    row.put("placa", ticket.getPlaca());
                    row.put("codigoEspacio", ticket.getEspacio().getCodigoEspacio());
                    row.put("usuario", obtenerEtiquetaUsuario(ticket));
                    row.put("horaEntrada", commonService.formatDateTime(ticket.getHoraEntrada()));
                    row.put("minutosEstadia", String.valueOf(Math.max(0, minutos)));
                    return new ReporteTablaFilaDTO(row);
                })
                .filter(row -> Long.parseLong(row.getColumnas().getOrDefault("minutosEstadia", "0")) >= umbral)
                .toList();

        return new ReporteTablaResponseDTO(
                "Estadias largas",
                columnas,
                filas,
                (long) filas.size());
    }

    private ReporteSerieTemporalResponseDTO construirSeriePorPeriodo(
            List<Ticket> tickets,
            Function<Ticket, LocalDateTime> extractor,
            String granularidad,
            String titulo,
            String unidad) {
        if ("hora".equals(granularidad)) {
            long[] conteoPorHora = agruparPorHora(tickets, extractor);
            List<ReporteSerieTemporalItemDTO> items = java.util.stream.IntStream.range(0, 24)
                    .mapToObj(hora -> new ReporteSerieTemporalItemDTO(
                            String.format("%02d:00", hora),
                            BigDecimal.valueOf(conteoPorHora[hora])))
                    .toList();
            return new ReporteSerieTemporalResponseDTO(titulo, unidad, items);
        }

        Map<String, Long> conteo = tickets.stream()
                .map(extractor)
                .filter(java.util.Objects::nonNull)
                .collect(Collectors.groupingBy(
                        dt -> construirEtiquetaPeriodo(dt, granularidad),
                        LinkedHashMap::new,
                        Collectors.counting()));

        List<ReporteSerieTemporalItemDTO> items = conteo.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(e -> new ReporteSerieTemporalItemDTO(e.getKey(), BigDecimal.valueOf(e.getValue())))
                .toList();

        return new ReporteSerieTemporalResponseDTO(titulo, unidad, items);
    }

    private long[] agruparPorHora(List<Ticket> tickets, Function<Ticket, LocalDateTime> extractor) {
        long[] conteoPorHora = new long[24];
        tickets.stream()
                .map(extractor)
                .filter(java.util.Objects::nonNull)
                .forEach(fechaHora -> conteoPorHora[fechaHora.getHour()]++);
        return conteoPorHora;
    }

    private List<Ticket> filtrarPorUsuario(List<Ticket> tickets, Long usuarioId) {
        if (usuarioId == null) {
            return tickets;
        }
        return tickets.stream()
                .filter(ticket -> ticket.getCreadoPor() != null)
                .filter(ticket -> ticket.getCreadoPor().getId() != null)
                .filter(ticket -> usuarioId.equals(ticket.getCreadoPor().getId()))
                .toList();
    }

    private List<Ticket> filtrarPorUsuarioYTipo(List<Ticket> tickets, Long usuarioId, String tipoVehiculo) {
        String tipoNormalizado = normalizarTipo(tipoVehiculo);
        return filtrarPorUsuario(tickets, usuarioId).stream()
                .filter(ticket -> !esTicketAnulado(ticket))
                .filter(ticket -> {
                    if (tipoNormalizado == null) {
                        return true;
                    }
                    if (ticket.getTipoVehiculo() == null || ticket.getTipoVehiculo().getNombre() == null) {
                        return false;
                    }
                    return tipoNormalizado.equals(ticket.getTipoVehiculo().getNombre().toUpperCase(Locale.ROOT));
                })
                .toList();
    }

    private boolean esTicketAnulado(Ticket ticket) {
        return ticket.getEstado() != null
                && ticket.getEstado().getNombre() != null
                && ESTADO_TICKET_ANULADO.equalsIgnoreCase(ticket.getEstado().getNombre());
    }

    private String normalizarGranularidad(String granularidad) {
        if (granularidad == null || granularidad.isBlank()) return "hora";
        String val = granularidad.trim().toLowerCase(Locale.ROOT);
        return switch (val) {
            case "dia", "semana", "mes", "hora" -> val;
            default -> "hora";
        };
    }

    private String construirEtiquetaPeriodo(LocalDateTime dt, String granularidad) {
        return switch (granularidad) {
            case "mes" -> String.format("%04d-%02d", dt.getYear(), dt.getMonthValue());
            case "semana" -> {
                java.time.temporal.WeekFields wf = WeekFields.ISO;
                int week = dt.get(wf.weekOfWeekBasedYear());
                int year = dt.get(wf.weekBasedYear());
                yield String.format("%04d-W%02d", year, week);
            }
            case "dia" -> dt.toLocalDate().toString();
            default -> String.format("%02d:00", dt.getHour());
        };
    }

    private String normalizarTipo(String tipoVehiculo) {
        if (tipoVehiculo == null) {
            return null;
        }
        String value = tipoVehiculo.trim().toUpperCase(Locale.ROOT);
        if (value.isEmpty() || "TODOS".equals(value)) {
            return null;
        }
        return value;
    }

    private String obtenerEtiquetaUsuario(Ticket ticket) {
        if (ticket.getCreadoPor() == null) {
            return "-";
        }
        String username = ticket.getCreadoPor().getUsername();
        if (username == null || username.isBlank()) {
            return "-";
        }
        return username;
    }
}
