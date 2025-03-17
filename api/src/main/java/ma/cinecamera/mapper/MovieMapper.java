package ma.cinecamera.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import ma.cinecamera.dto.req.MovieReqDto;
import ma.cinecamera.dto.resp.MovieRespDto;
import ma.cinecamera.model.Movie;
import ma.cinecamera.model.enums.MovieStatus;

@Mapper(componentModel = "spring")
public interface MovieMapper {
    @Mapping(target = "id", source = "entity.id")
    @Mapping(target = "createdAt", source = "entity.createdAt")
    @Mapping(target = "updatedAt", source = "entity.updatedAt")
    @Mapping(target = "status", source = "entity.status", qualifiedByName = "statusToDisplayName")
    MovieRespDto entityToDto(Movie entity);

    @Named("statusToDisplayName")
    default String statusToDisplayName(MovieStatus status) {
	return status != null ? status.getDisplayName() : null;
    }

    Movie DtoToEntity(MovieReqDto dto);

    @Mapping(target = "id", source = "entity.id")
    @Mapping(target = "createdAt", source = "entity.createdAt")
    @Mapping(target = "updatedAt", source = "entity.updatedAt")
    @Mapping(target = "status", source = "entity.status", qualifiedByName = "statusToDisplayName")
    List<MovieRespDto> entitiesToDto(List<Movie> entities);
}
