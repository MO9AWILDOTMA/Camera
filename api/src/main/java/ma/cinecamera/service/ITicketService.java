package ma.cinecamera.service;

import java.util.List;

import com.lowagie.text.DocumentException;

import ma.cinecamera.dto.req.TicketDownloadReq;
import ma.cinecamera.model.Reservation;
import ma.cinecamera.model.Ticket;

public interface ITicketService {

    List<Ticket> buildTickets(Reservation reservation);

    List<Ticket> createTickets(List<Ticket> tickets);

    byte[] generateTicket(TicketDownloadReq req) throws DocumentException;

    List<Ticket> getTicketsByCodes(List<String> codes);
}
