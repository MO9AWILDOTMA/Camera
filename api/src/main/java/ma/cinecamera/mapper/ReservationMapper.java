package ma.cinecamera.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import ma.cinecamera.dto.req.ReservationReqDto;
import ma.cinecamera.dto.resp.ReservationRespDto;
import ma.cinecamera.model.Reservation;

@Mapper(componentModel = "spring", uses = { TicketMapper.class })
public interface ReservationMapper {
    @Mapping(target = "id", source = "entity.id")
    @Mapping(target = "createdAt", source = "entity.createdAt")
    @Mapping(target = "updatedAt", source = "entity.updatedAt")
    ReservationRespDto entityToDto(Reservation entity);

    Reservation DtoToEntity(ReservationReqDto dto);

    List<ReservationRespDto> entitiesToDto(List<Reservation> entities);
}
