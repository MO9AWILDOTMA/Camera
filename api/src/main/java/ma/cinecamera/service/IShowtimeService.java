package ma.cinecamera.service;

import ma.cinecamera.dto.req.ShowtimeReqDto;
import ma.cinecamera.dto.resp.GlobalResp;
import ma.cinecamera.dto.resp.ListResponse;
import ma.cinecamera.dto.resp.ShowtimeRespDto;
import ma.cinecamera.model.Showtime;

public interface IShowtimeService {

    Showtime getById(Long id);

    ListResponse getAllShowtimes(Integer page, Integer size);

    ShowtimeRespDto getShowtimeDetail(String slug);

    ShowtimeRespDto createShowtime(ShowtimeReqDto dto);

    ShowtimeRespDto updateShowtime(Long id, ShowtimeReqDto dto);

    GlobalResp deleteShowtime(Long id);

}
