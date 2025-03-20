package ma.cinecamera.service.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import ma.cinecamera.dto.req.DiscountReqDto;
import ma.cinecamera.dto.resp.DiscountRespDto;
import ma.cinecamera.dto.resp.GlobalResp;
import ma.cinecamera.dto.resp.ListResponse;
import ma.cinecamera.exception.ResourceNotFoundException;
import ma.cinecamera.exception.ResourceValidationException;
import ma.cinecamera.mapper.DiscountMapper;
import ma.cinecamera.model.Discount;
import ma.cinecamera.repository.DiscountRepository;
import ma.cinecamera.service.IDiscountService;
import ma.cinecamera.validation.DiscountValidator;

@Service
public class DiscountService implements IDiscountService {

    private final Logger logger = Logger.getLogger(DiscountService.class.getName());

    @Autowired
    private DiscountRepository repository;

    @Autowired
    private DiscountMapper mapper;

    @Autowired
    private DiscountValidator validator;

    @Override
    public Discount getById(Long id) {
	return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Discount Not Found"));
    }

    @Override
    public ListResponse getAll(Integer page, Integer size) {
	page = page > 0 ? page - 1 : 0;
	size = size < 3 ? 3 : size;
	Pageable pageable = PageRequest.of(page, size);
	Page<Discount> res = repository.findAll(pageable);
	List<Discount> discounts = res.getContent();
	Long totalElements = res.getTotalElements();
	Integer totalPages = res.getTotalPages();
	List<DiscountRespDto> respDto = mapper.entitiesToDto(discounts);
	return ListResponse.builder().content(respDto).totalElements(totalElements).totalPages(totalPages).build();
    }

    @Override
    public DiscountRespDto getDetail(Long id) {
	return mapper.entityToDto(getById(id));
    }

    @Override
    public DiscountRespDto create(DiscountReqDto dto) {
	Discount discount = mapper.DtoToEntity(dto);

	logger.warning("***" + validator.checkDiscountPercentage(discount.getPercentage()) + "***");
	if (validator.checkDiscountPercentage(discount.getPercentage())) {
	    throw new ResourceValidationException(
		    "Discount percetage cannot be more than 1 or less than 0 (100% - 0%)");
	}
	return mapper.entityToDto(repository.save(discount));
    }

    @Override
    public DiscountRespDto update(Long id, DiscountReqDto dto) {
	Discount discount = getById(id);
	if (validator.checkDiscountPercentage(dto.getPercentage())) {
	    throw new ResourceValidationException(
		    "Discount percetage cannot be more than 1 and less than 0 (100% - 0%)");
	}
	discount.setName(dto.getName());
	discount.setPercentage(dto.getPercentage());

	return mapper.entityToDto(repository.save(discount));
    }

    @Override
    public GlobalResp delete(Long id) {
	Discount discount = getById(id);
	repository.delete(discount);
	return GlobalResp.builder().id(id).createdAt(discount.getCreatedAt()).updatedAt(discount.getUpdatedAt())
		.message("Discount deleted successfully").build();
    }

    @Override
    public Set<Discount> getDiscounts(List<Long> ids) {
	List<Discount> discountList = repository.findAllById(ids);
	return new HashSet<>(discountList);
    }

}
