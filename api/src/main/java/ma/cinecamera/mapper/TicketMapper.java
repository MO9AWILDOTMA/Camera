package ma.cinecamera.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import ma.cinecamera.dto.resp.TicketResp;
import ma.cinecamera.model.Ticket;

@Mapper(componentModel = "spring")
public interface TicketMapper {
    @Mapping(target = "id", source = "entity.id")
    @Mapping(target = "createdAt", source = "entity.createdAt")
    @Mapping(target = "updatedAt", source = "entity.updatedAt")
    TicketResp entityToDto(Ticket entity);
}
