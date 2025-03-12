package ma.cinecamera.service.impl;

import java.io.ByteArrayOutputStream;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.xhtmlrenderer.pdf.ITextRenderer;

import com.lowagie.text.DocumentException;

import ma.cinecamera.exception.ResourceNotFoundException;
import ma.cinecamera.mapper.TicketMapper;
import ma.cinecamera.model.Movie;
import ma.cinecamera.model.Reservation;
import ma.cinecamera.model.Showtime;
import ma.cinecamera.model.Ticket;
import ma.cinecamera.model.User;
import ma.cinecamera.repository.TicketRepository;
import ma.cinecamera.service.ITicketService;

@Service
public class TicketService implements ITicketService {

    @Autowired
    private TicketRepository repository;

    @Autowired
    private TemplateEngine templateEngine;

    @Autowired
    private TicketMapper mapper;

    @Override
    public Ticket getTicketByCode(String code) {
	return repository.findByUniqueCode(code).orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
    }

    @Override
    public byte[] generateTicket(String code) throws DocumentException {
	// Get ticket data
	Ticket ticket = getTicketByCode(code);

	// Prepare the Thymeleaf context
	Context context = new Context();
	context.setVariable("ticket", ticket);

	// You can send additional data if needed
	context.setVariable("cinemaName", "Camera");
	context.setVariable("ticketType", ticket.getType());
	context.setVariable("ticketCode", ticket.getUniqueCode());
	context.setVariable("date", ticket.getTime().toLocalDate());
	context.setVariable("time", ticket.getTime().toLocalTime());
	context.setVariable("screeningRoom", ticket.getReservation().getShowtime().getScreeningRoom().getName());

	// Process HTML template with the data
	String ticketHtml = templateEngine.process("ticket-pdf", context);

	// Generate PDF from the processed HTML
	ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
	ITextRenderer renderer = new ITextRenderer();
	renderer.setDocumentFromString(ticketHtml);
	renderer.layout();
	renderer.createPDF(outputStream);

	return outputStream.toByteArray();
    }

    @Override
    public Ticket createTicket(Ticket ticket) {
	Ticket savedTicket = repository.save(ticket);
	return ticket;
    }

    @Override
    public Ticket buildTicket(Reservation reservation) {
	User user = reservation.getUser();
	Showtime showtime = reservation.getShowtime();
	Movie movie = showtime.getMovie();
	return Ticket.builder().reservation(reservation).seat(reservation.getSeat())
		.customerName(user.getFirstName() + " " + user.getLastName()).movieTitle(movie.getName())
		.time(showtime.getDateTime()).uniqueCode(getUniqueCode()).type("Movie").build();
    }

    private String getUniqueCode() {
	return UUID.randomUUID().toString();
    }

}
