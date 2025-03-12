package ma.cinecamera.service.impl;

import java.util.List;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.fasterxml.jackson.databind.JsonNode;

import ma.cinecamera.dto.req.TransactionReq;
import ma.cinecamera.dto.resp.GlobalResp;
import ma.cinecamera.dto.resp.TransactionResp;
import ma.cinecamera.exception.ResourceNotFoundException;
import ma.cinecamera.mapper.TransactionMapper;
import ma.cinecamera.model.Transaction;
import ma.cinecamera.model.enums.TransactionStatus;
import ma.cinecamera.repository.TransactionRepository;
import ma.cinecamera.service.ITransactionService;
import reactor.core.publisher.Mono;

@Service
public class TransactionService implements ITransactionService {

    @Value("${youcanpay.private-key}")
    private String privateKey;

    private final WebClient webClient;

    @Autowired
    private TransactionMapper mapper;

    @Autowired
    private TransactionRepository repository;

    private final Logger logger = Logger.getLogger(PaymentService.class.getName());

    @Override
    public Transaction getById(Long id) {
	return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Transaction Not Found"));
    }

    public TransactionService(WebClient.Builder webClientBuilder) {
	this.webClient = webClientBuilder.baseUrl("https://api.youcanpay.com").build();
    }

    @Override
    public List<TransactionResp> getAll(Integer page, Integer size) {
	page = page > 0 ? page - 1 : 0;
	size = size < 3 ? 3 : size;
	Pageable pageable = PageRequest.of(page, size);
	List<Transaction> transactions = repository.findAll(pageable).getContent();
	return mapper.entitiesToDto(transactions);
    }

    @Override
    public TransactionResp getDetail(Long id) {
	return mapper.entityToDto(getById(id));
    }

    @Override
    public Transaction genrateToken(TransactionReq req) {
	Mono<JsonNode> jsonResponseMono = webClient.post().uri("/payment-tokens")
		.header("Authorization", "Bearer " + privateKey)
		.contentType(org.springframework.http.MediaType.APPLICATION_JSON).bodyValue(req).retrieve()
		.bodyToMono(JsonNode.class)
		.onErrorMap(error -> new RuntimeException("Failed to create payment token", error));

	JsonNode jsonResponse = jsonResponseMono.block();
	// Extract the token ID from the JSON response
	String tokenId = jsonResponse.path("token").path("id").asText();
	Transaction transaction = Transaction.builder().token(tokenId).build();
	return repository.save(transaction);

    }

    @Override
    public TransactionResp processTransaction(TransactionReq req) {
	// TODO Auto-generated method stub
	return null;
    }

    @Override
    public GlobalResp updateTransactionStatus(Long id, TransactionStatus status) {
	Transaction transaction = getById(id);

	transaction.setStatus(status);
	repository.save(transaction);
	return GlobalResp.builder().message("Transaction status updated successfully").build();
    }

    @Override
    public GlobalResp delete(Long id) {
	Transaction transaction = getById(id);

	repository.delete(transaction);
	return GlobalResp.builder().message("Transaction deleted succussfully").id(id)
		.createdAt(transaction.getCreatedAt()).updatedAt(transaction.getUpdatedAt()).build();
    }

}
