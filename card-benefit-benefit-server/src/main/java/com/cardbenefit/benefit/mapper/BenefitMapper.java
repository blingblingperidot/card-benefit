package com.cardbenefit.benefit.mapper;

import org.apache.ibatis.annotations.Mapper;
import java.util.List;
import java.util.Map;

@Mapper
public interface BenefitMapper {

	List<Map<String, Object>> getCardBenefit(String cardType);

    void insertBenefit(Map<String, Object> map);

    void deleteBenefit(Map<String, Object> map);
    
    List<Map<String, Object>> getAllBenefits();    
    List<Map<String, Object>> getProducts(String storeName);
}