package ma.cinecamera.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import ma.cinecamera.dto.req.ShowtimeReqDto;
import ma.cinecamera.dto.resp.ShowtimeRespDto;
import ma.cinecamera.model.Showtime;

@Mapper(componentModel = "spring")
public interface ShowtimeMapper {
    @Mapping(target = "id", source = "entity.id")
    @Mapping(target = "createdAt", source = "entity.createdAt")
    @Mapping(target = "updatedAt", source = "entity.updatedAt")
    ShowtimeRespDto entityToDto(Showtime entity);

    Showtime DtoToEntity(ShowtimeReqDto dto);

    @Mapping(target = "id", source = "entity.id")
    @Mapping(target = "createdAt", source = "entity.createdAt")
    @Mapping(target = "updatedAt", source = "entity.updatedAt")
    List<ShowtimeRespDto> entitiesToDto(List<Showtime> entities);
}
