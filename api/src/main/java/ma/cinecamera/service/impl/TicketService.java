package ma.cinecamera.service.impl;

import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.xhtmlrenderer.pdf.ITextRenderer;

import com.lowagie.text.DocumentException;

import ma.cinecamera.dto.req.TicketDownloadReq;
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

    @SuppressWarnings("unused")
    private final Logger logger = Logger.getLogger(TicketService.class.getName());

    @Override
    public List<Ticket> getTicketsByCodes(List<String> codes) {
	if (!repository.existsByUniqueCodeIn(codes)) {
	    throw new ResourceNotFoundException("Tickets not found");
	}
	logger.warning("*** tickets existence checked ***");
	return repository.findByUniqueCodeIn(codes);
    }

    /**
     * Generates a PDF containing multiple movie tickets based on provided ticket
     * codes
     * 
     * @param codes Array of ticket codes to generate tickets for
     * @return byte array containing the generated PDF document
     */
    @Override
    public byte[] generateTicket(TicketDownloadReq req) throws DocumentException {
	logger.warning("***entered***");
	// Get ticket data for all provided codes
	List<Ticket> tickets = getTicketsByCodes(req.getCodes());

	logger.warning("***got tickets***");

	// Prepare the Thymeleaf context
	Context context = new Context();
	context.setVariable("tickets", tickets);
	context.setVariable("logoPath", "/images/camera-logo.png");

	// Set cinema name as a common variable
	context.setVariable("cinemaName", "CINEMA CAMERA");

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

    private Ticket createTicket(Ticket ticket) {
	Ticket savedTicket = repository.save(ticket);
	return ticket;
    }

    @Override
    public List<Ticket> createTickets(List<Ticket> ticketsReq) {
	List<Ticket> tickets = new ArrayList<Ticket>();
	ticketsReq.forEach(t -> {
	    tickets.add(createTicket(t));
	});

	return tickets;
    }

    @Override
    public List<Ticket> buildTickets(Reservation reservation) {
	User user = reservation.getUser();
	Showtime showtime = reservation.getShowtime();
	Movie movie = showtime.getMovie();
	String[] seats = reservation.getSeats();
	List<Ticket> tickets = new ArrayList<Ticket>();
	for (String seat : seats) {
	    Ticket ticket = Ticket.builder().reservation(reservation).seat(seat)
		    .customerName(user.getFirstName() + " " + user.getLastName()).movieTitle(movie.getName())
		    .time(showtime.getDateTime()).uniqueCode(getUniqueCode()).type("Movie").build();
	    tickets.add(ticket);
	}
	return tickets;
    }

    private String getUniqueCode() {
	return UUID.randomUUID().toString();
    }

}
