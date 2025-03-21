package ma.cinecamera.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import ma.cinecamera.dto.req.PaymentReqDto;
import ma.cinecamera.dto.resp.PaymentRespDto;
import ma.cinecamera.model.Payment;

@Mapper(componentModel = "spring", uses = { ReservationMapper.class, UserMapper.class, TransactionMapper.class })
public interface PaymentMapper {

    @Mapping(target = "id", source = "entity.id")
    @Mapping(target = "createdAt", source = "entity.createdAt")
    @Mapping(target = "updatedAt", source = "entity.updatedAt")
    PaymentRespDto entityToDto(Payment entity);

    Payment DtoToEntity(PaymentReqDto dto);

    List<PaymentRespDto> entitiesToDto(List<Payment> entities);
}
