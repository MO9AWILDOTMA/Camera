package ma.cinecamera.service.impl;

import java.util.List;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import ma.cinecamera.dto.req.PaymentReqDto;
import ma.cinecamera.dto.req.PaymentUpdateDto;
import ma.cinecamera.dto.resp.GlobalResp;
import ma.cinecamera.dto.resp.ListResponse;
import ma.cinecamera.dto.resp.PaymentRespDto;
import ma.cinecamera.exception.ResourceNotFoundException;
import ma.cinecamera.exception.ResourceValidationException;
import ma.cinecamera.mapper.PaymentMapper;
import ma.cinecamera.model.Payment;
import ma.cinecamera.model.Reservation;
import ma.cinecamera.model.Ticket;
import ma.cinecamera.model.User;
import ma.cinecamera.model.enums.ActivityType;
import ma.cinecamera.model.enums.PaymentStatus;
import ma.cinecamera.model.enums.ReservationStatus;
import ma.cinecamera.repository.PaymentRepository;
import ma.cinecamera.repository.ReservationRepository;
import ma.cinecamera.service.IPaymentService;
import ma.cinecamera.service.IReservationService;
import ma.cinecamera.service.ITicketService;
import ma.cinecamera.service.ITransactionService;
import ma.cinecamera.service.IUserService;
import ma.cinecamera.validation.PaymentValidator;

@Service
public class PaymentService implements IPaymentService {

    @Autowired
    private PaymentRepository repository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private PaymentMapper mapper;

    @Autowired
    private IUserService userService;

    @Autowired
    private IReservationService reservationService;

    @Autowired
    private ITransactionService transactionService;

    @Autowired
    private ITicketService ticketService;

    @Autowired
    private PaymentValidator validator;

    @Autowired
    private ActivityService activityService;

    private final Logger logger = Logger.getLogger(PaymentService.class.getName());

    @Override
    public Payment getById(Long id) {
	return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Payment Not Found"));
    }

    @Override
    public ListResponse getAll(Integer page, Integer size) {
	page = page > 0 ? page - 1 : 0;
	size = size < 3 ? 3 : size;
	Pageable pageable = PageRequest.of(page, size);
	Page<Payment> res = repository.findAll(pageable);
	List<Payment> payments = res.getContent();
	Long totalElements = res.getTotalElements();
	Integer totalPages = res.getTotalPages();
	List<PaymentRespDto> respDto = mapper.entitiesToDto(payments);
	return ListResponse.builder().content(respDto).totalElements(totalElements).totalPages(totalPages).build();
    }

    @Override
    public PaymentRespDto create(PaymentReqDto dto) {
	Long userId = dto.getUserId();
	User user = userService.getById(userId);
	Reservation reservation = reservationService.getById(dto.getReservationId());

	if (validator.checkIfThereIsPaymentPending(userId)) {
	    throw new ResourceValidationException("Cannot create two Payments in the same time");
	}

//	TransactionReq transactionReq = TransactionReq.builder().amount(dto.getAmount()).orderId(dto.getReservationId())
//		.currency(dto.getCurrency())
//		.customer(new TransactionUserDto(user.getFirstName() + " " + user.getLastName(), user.getEmail()))
//		.build();
//	Transaction transaction = transactionService.genrateToken(transactionReq);
//	payment.setTransaction(transaction);

	List<Ticket> tickets = ticketService.createTickets(ticketService.buildTickets(reservation));

	Payment payment = mapper.DtoToEntity(dto);

	reservation.setStatus(ReservationStatus.CONFIRMED);
	reservation.setTickets(tickets);
	payment.setUser(user);
	payment.setReservation(reservation);
	payment.setStatus(PaymentStatus.CONFIRMED);

	Payment savedPayment = repository.save(payment);
	reservationRepository.save(reservation);

	int seatsNbr = reservation.getSeats().length;
	String activityMessage = seatsNbr > 1 ? seatsNbr + " tickets for " : "1 ticket for ";

	activityMessage = activityMessage + reservation.getShowtime().getMovie().getName();

	activityService.createActivity(ActivityType.RESERVATION, activityMessage);

	return mapper.entityToDto(savedPayment);
    }

    @Override
    public PaymentRespDto update(Long id, PaymentUpdateDto dto) {
	Payment payment = getById(id);
	Long userId = dto.getUserId();
	User user = userService.getById(userId);
	Reservation reservation = reservationService.getById(dto.getReservationId());

	if (!userId.equals(payment.getUser().getId())) {
	    if (validator.checkIfThereIsPaymentPending(userId)) {
		throw new ResourceValidationException("Cannot create two Payments in the same time");
	    }
	    payment.setUser(user);
	}

	payment.setReservation(reservation);
	payment.setStatus(dto.getStatus());

	Payment updatedPayment = repository.save(payment);
	return mapper.entityToDto(updatedPayment);
    }

    @Override
    public GlobalResp delete(Long id) {
	Payment payment = getById(id);

	repository.delete(payment);
	return GlobalResp.builder().message("Payment deleted successfully").id(id).createdAt(payment.getCreatedAt())
		.updatedAt(payment.getUpdatedAt()).build();
    }

    @Override
    public GlobalResp cancelPayment(Long id) {
	Payment payment = getById(id);
	if (!validator.checkIfUserAuthorizedOfCancelingPayment(payment)) {
	    throw new ResourceValidationException("Cannot cancel this Payment User not authorized");
	}
	payment.setStatus(PaymentStatus.CANCELLED);
	repository.save(payment);
	return GlobalResp.builder().message("Payment cancelled successfully").build();
    }

    @Override
    public GlobalResp archive(Long id) {
	Payment payment = getById(id);
	payment.setStatus(PaymentStatus.CANCELLED);
	repository.save(payment);
	return GlobalResp.builder().message("Payment archived successfully").build();
    }

}
