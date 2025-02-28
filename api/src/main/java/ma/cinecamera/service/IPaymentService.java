package ma.cinecamera.service;

import java.util.List;

import ma.cinecamera.dto.req.PaymentReqDto;
import ma.cinecamera.dto.req.PaymentUpdateDto;
import ma.cinecamera.dto.resp.GlobalResp;
import ma.cinecamera.dto.resp.PaymentRespDto;
import ma.cinecamera.model.Payment;

public interface IPaymentService {
    Payment getById(Long id);

    PaymentRespDto create(PaymentReqDto dto);

    PaymentRespDto update(Long id, PaymentUpdateDto dto);

    List<PaymentRespDto> getAll(Integer page, Integer size);

    GlobalResp delete(Long id);

    GlobalResp cancelPayment(Long id);

    GlobalResp archive(Long id);
}
