package ma.cinecamera.service;

import com.lowagie.text.DocumentException;

import ma.cinecamera.model.Reservation;
import ma.cinecamera.model.Ticket;

public interface ITicketService {

    Ticket getTicketByCode(String code);

    Ticket createTicket(Ticket ticket);

    byte[] generateTicket(String code) throws DocumentException;

    Ticket buildTicket(Reservation reservation);
}
