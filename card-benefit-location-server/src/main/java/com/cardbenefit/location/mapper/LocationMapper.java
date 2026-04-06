package com.cardbenefit.location.mapper;

import org.apache.ibatis.annotations.Mapper;
import java.util.List;
import java.util.Map;

@Mapper
public interface LocationMapper {

    // 전체 혜택 목록 조회 (위도/경도 포함)
    List<Map<String, Object>> getAllBenefits();
}