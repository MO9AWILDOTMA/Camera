package ma.cinecamera.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import ma.cinecamera.dto.req.MovieReqDto;
import ma.cinecamera.dto.resp.MovieRespDto;
import ma.cinecamera.model.Movie;

@Mapper(componentModel = "spring")
public interface MovieMapper {
	@Mapping(target = "id", source = "entity.id")
	@Mapping(target = "createdAt", source = "entity.createdAt")
	@Mapping(target = "updatedAt", source = "entity.updatedAt")
	MovieRespDto entityToDto(Movie entity);

	Movie DtoToentity(MovieReqDto dto);
}
