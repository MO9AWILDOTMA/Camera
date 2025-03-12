package ma.cinecamera.service;

import java.util.List;

import ma.cinecamera.dto.req.ShowtimeReqDto;
import ma.cinecamera.dto.resp.GlobalResp;
import ma.cinecamera.dto.resp.ShowtimeRespDto;
import ma.cinecamera.model.Showtime;

public interface IShowtimeService {

    Showtime getById(Long id);

    List<ShowtimeRespDto> getAllShowtimes(Integer page, Integer size);

    ShowtimeRespDto getShowtimeDetail(Long id);

    ShowtimeRespDto createShowtime(ShowtimeReqDto dto);

    ShowtimeRespDto updateShowtime(Long id, ShowtimeReqDto dto);

    GlobalResp deleteShowtime(Long id);

}
