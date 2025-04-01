package ma.cinecamera.service;

import ma.cinecamera.dto.req.ReservationReqDto;
import ma.cinecamera.dto.req.ReservationUpdateDto;
import ma.cinecamera.dto.resp.GlobalResp;
import ma.cinecamera.dto.resp.ListResponse;
import ma.cinecamera.dto.resp.ReservationRespDto;
import ma.cinecamera.model.Reservation;

public interface IReservationService {

    Reservation getById(Long id);

    ReservationRespDto create(ReservationReqDto dto);

    ReservationRespDto update(Long id, ReservationUpdateDto dto);

    ListResponse getAll(Integer page, Integer size);

    GlobalResp delete(Long id);

    GlobalResp cancelReservation(Long id);

    GlobalResp archive(Long id);

    ReservationRespDto getDetails(Long id);

}
