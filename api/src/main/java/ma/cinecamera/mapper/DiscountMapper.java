package ma.cinecamera.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import ma.cinecamera.dto.req.DiscountReqDto;
import ma.cinecamera.dto.resp.DiscountRespDto;
import ma.cinecamera.model.Discount;

@Mapper(componentModel = "spring")
public interface DiscountMapper {
    @Mapping(target = "id", source = "entity.id")
    @Mapping(target = "createdAt", source = "entity.createdAt")
    @Mapping(target = "updatedAt", source = "entity.updatedAt")
    DiscountRespDto entityToDto(Discount entity);

    Discount DtoToEntity(DiscountReqDto dto);

    @Mapping(target = "id", source = "entity.id")
    @Mapping(target = "createdAt", source = "entity.createdAt")
    @Mapping(target = "updatedAt", source = "entity.updatedAt")
    List<DiscountRespDto> entitiesToDto(List<Discount> entities);
}
