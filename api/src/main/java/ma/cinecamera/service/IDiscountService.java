package ma.cinecamera.service;

import java.util.List;
import java.util.Set;

import ma.cinecamera.dto.req.DiscountReqDto;
import ma.cinecamera.dto.resp.DiscountRespDto;
import ma.cinecamera.dto.resp.GlobalResp;
import ma.cinecamera.model.Discount;

public interface IDiscountService {
    Discount getById(Long id);

    List<DiscountRespDto> getAll(Integer page, Integer size);

    DiscountRespDto getDetail(Long id);

    DiscountRespDto create(DiscountReqDto dto);

    DiscountRespDto update(Long id, DiscountReqDto dto);

    GlobalResp delete(Long id);

    Set<Discount> getDiscounts(List<Long> ids);
}
