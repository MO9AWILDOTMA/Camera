package ma.cinecamera.service;

import java.util.List;

import ma.cinecamera.dto.req.TransactionReq;
import ma.cinecamera.dto.resp.GlobalResp;
import ma.cinecamera.dto.resp.TransactionResp;
import ma.cinecamera.model.Transaction;
import ma.cinecamera.model.enums.TransactionStatus;

public interface ITransactionService {

    Transaction getById(Long id);

    List<TransactionResp> getAll(Integer page, Integer size);

    TransactionResp getDetail(Long id);

    Transaction genrateToken(TransactionReq req);

    TransactionResp processTransaction(TransactionReq req);

    GlobalResp updateTransactionStatus(Long id, TransactionStatus status);

    GlobalResp delete(Long id);

}
