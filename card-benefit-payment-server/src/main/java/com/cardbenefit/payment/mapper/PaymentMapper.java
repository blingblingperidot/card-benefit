package com.cardbenefit.payment.mapper;

import org.apache.ibatis.annotations.Mapper;
import java.util.List;
import java.util.Map;

@Mapper
public interface PaymentMapper {

    // payment_id 채번
    String getNextPaymentId();

    // 결제 이력 INSERT
    void insertPaymentLog(Map<String, Object> map);

    // 결제 상태 UPDATE
    void updatePaymentStatus(Map<String, Object> map);

    // 결제 내역 조회
    List<Map<String, Object>> getPaymentList(Map<String, Object> map);

    // partner_order_id로 결제 조회
    Map<String, Object> getPaymentByOrderId(String partnerOrderId);
}