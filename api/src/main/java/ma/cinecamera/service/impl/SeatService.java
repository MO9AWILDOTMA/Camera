package ma.cinecamera.service.impl;

import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ma.cinecamera.dto.resp.SeatChecker;
import ma.cinecamera.exception.ResourceNotFoundException;
import ma.cinecamera.exception.ResourceValidationException;
import ma.cinecamera.model.ScreeningRoom;
import ma.cinecamera.model.Seat;
import ma.cinecamera.model.enums.SeatStatus;
import ma.cinecamera.repository.SeatRepository;
import ma.cinecamera.service.ISeatService;

@Service
public class SeatService implements ISeatService {

    @Autowired
    private SeatRepository repository;

    @Override
    public Seat getById(Long id) {
	return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Discount Not Found"));
    }

    @Override
    @Transactional
    public void createSeats(ScreeningRoom screen) {
	Integer rowSize = screen.getRowSize();
	Integer totalSeats = screen.getTotalSeats();

	if (screen == null || rowSize == null || rowSize < 5) {
	    throw new ResourceValidationException(
		    "Cannot create Seats check Screening Room or row size should be greater than 5");
	} else if (rowSize > totalSeats) {
	    throw new ResourceValidationException(
		    "Cannot create Seats: row size should'nt be greater than total seats");
	}
	List<String> rows = createRows(rowSize, totalSeats);
	List<Seat> seatsToSave = new ArrayList<>();

	for (String row : rows) {
	    for (int i = 0; i < rowSize; i++) {
		Seat seat = Seat.builder().number(i + 1).row(row).screeningRoom(screen).status(SeatStatus.AVAILABLE)
			.build();
		seatsToSave.add(seat);
	    }
	}

	repository.saveAll(seatsToSave); // Batch save instead of individual saves
    }

    private List<String> createRows(Integer rowSize, Integer totalSeats) {
	int totalRows = (int) Math.ceil((double) totalSeats / rowSize);
	List<String> rows = new ArrayList<>();
	String[] alphabet = { "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R",
		"S", "T", "U", "V", "W", "X", "Y", "Z" };

	for (int i = 0; i < totalRows; i++) {
	    if (i < alphabet.length) {
		rows.add(alphabet[i]);
	    } else {
		// For more than 26 rows, use AA, AB, AC, etc.
		String firstLetter = alphabet[(i / alphabet.length) - 1];
		String secondLetter = alphabet[i % alphabet.length];
		rows.add(firstLetter + secondLetter);
	    }
	}

	return rows;
    }

    @Override
    public SeatChecker checkAvaibality(Long id) {
	Seat seat = getById(id);
	return SeatChecker.builder().available(seat.getStatus().equals(SeatStatus.AVAILABLE)).build();
    }

    @Override
    public void updateStatus(Long id, SeatStatus status) {
	Seat seat = getById(id);
	seat.setStatus(status);
	repository.save(seat);
    }

    @Override
    public void deleteSeats(List<Seat> seats) {
	repository.deleteAll(seats);
    }

}
