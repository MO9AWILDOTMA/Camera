package ma.cinecamera.service;

import java.io.IOException;
import java.util.List;

import org.springframework.core.io.support.ResourceRegion;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import ma.cinecamera.dto.req.MovieReqDto;
import ma.cinecamera.dto.resp.GlobalResp;
import ma.cinecamera.dto.resp.ListResponse;
import ma.cinecamera.dto.resp.MovieRespDto;
import ma.cinecamera.model.Movie;

@Service
public interface IMovieService {

    Movie getMovieById(Long id);

    MovieRespDto getMovieDetail(String slug);

    ListResponse getAllMovies(Integer page, Integer size);

    MovieRespDto createMovie(MovieReqDto dto) throws IOException;

    MovieRespDto updateMovie(Long id, MovieReqDto dto) throws IOException;

    GlobalResp deleteMovie(Long id);

    ListResponse search(String q, String genre, Integer page, Integer size);

    List<MovieRespDto> currentAndUpcomingmovies(Integer page, Integer size);

    ResponseEntity<GlobalResp> uploadMovieTrailer(MultipartFile file, Long movieId);

    ResponseEntity<ResourceRegion> streamMovieTrailer(Long movieId, HttpHeaders headers);

}
