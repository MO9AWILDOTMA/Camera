package ma.cinecamera.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import ma.cinecamera.dto.req.ScreeningRoomReqDto;
import ma.cinecamera.dto.resp.ScreeningRoomRespDto;
import ma.cinecamera.model.ScreeningRoom;

@Mapper(componentModel = "spring")
public interface ScreeningRoomMapper {
    @Mapping(target = "id", source = "entity.id")
    @Mapping(target = "createdAt", source = "entity.createdAt")
    @Mapping(target = "updatedAt", source = "entity.updatedAt")
    ScreeningRoomRespDto entityToDto(ScreeningRoom entity);

    ScreeningRoom DtoToEntity(ScreeningRoomReqDto dto);

    @Mapping(target = "id", source = "entity.id")
    @Mapping(target = "createdAt", source = "entity.createdAt")
    @Mapping(target = "updatedAt", source = "entity.updatedAt")
    List<ScreeningRoomRespDto> entitiesToDto(List<ScreeningRoom> entities);
}
