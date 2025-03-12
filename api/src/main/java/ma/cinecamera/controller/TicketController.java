package ma.cinecamera.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ma.cinecamera.service.ITicketService;

@RestController
@RequestMapping("/api")
public class TicketController {
    @Autowired
    private ITicketService service;

    /**
     * API endpoint to download a ticket as PDF
     * 
     * @param id Ticket Code
     * @return PDF file as response
     */
    @GetMapping("/cinephile/tickets/{code}/download")
    public ResponseEntity<byte[]> downloadTicket(@PathVariable("code") String code) {

	try {
	    byte[] pdfBytes = service.generateTicket(code);
	    // Set up headers
	    HttpHeaders headers = new HttpHeaders();
	    headers.setContentType(MediaType.APPLICATION_PDF);
	    headers.setContentDispositionFormData("attachment", "ticket-" + code + ".pdf");
	    headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
	    return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);

	} catch (Exception e) {
	    e.printStackTrace();
	    return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	}
    }
}
