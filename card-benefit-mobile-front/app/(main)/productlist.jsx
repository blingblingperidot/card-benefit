import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import api from '../../api/axios';

export default function ProductListScreen() {

  // ==============================================================
  //                        변수 정의
  // ==============================================================
  const router = useRouter();
  const { storeName, benefit: benefitStr, cardId, cardType, cardName } = useLocalSearchParams();
  const benefit = benefitStr ? JSON.parse(benefitStr) : null;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, paddingTop: 60 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
    discountBadge: { color: '#4A90E2', fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
    error: { color: 'red', marginBottom: 8, textAlign: 'center' },
    loading: { textAlign: 'center', color: '#666', marginTop: 40 },
    empty: { textAlign: 'center', color: '#666', marginTop: 40 },
    card: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 16, marginBottom: 12 },
    productName: { fontWeight: 'bold', fontSize: 16 },
    description: { color: '#666', marginTop: 4, fontSize: 13 },
    priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
    originalPrice: { color: '#999', textDecorationLine: 'line-through', fontSize: 14 },
    discountPrice: { color: '#E24B4A', fontSize: 14 },
    finalPrice: { fontWeight: 'bold', fontSize: 16, color: '#333', marginTop: 4 },
    payButton: { backgroundColor: '#4A90E2', padding: 10, borderRadius: 6, alignItems: 'center', marginTop: 8 },
    payButtonText: { color: '#fff', fontWeight: 'bold' },
    backButton: { padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
    backButtonText: { color: '#4A90E2' },
  });

  // ==============================================================
  //                        데이터 조회 처리
  // ==============================================================
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/benefits/getProducts?storeName=${storeName}`);
      setProducts(response.data);
    } catch (err) {
      setError('상품 목록 조회 실패');
    } finally {
      setLoading(false);
    }
  };

  // ==============================================================
  //                        할인 계산
  // ==============================================================
  const calcDiscount = (price) => {
    if (!benefit) return { discountAmount: 0, finalAmount: price };
    if (benefit.DISCOUNT_TYPE === 'RATE') {
      const discountAmount = Math.floor(price * (benefit.DISCOUNT_RATE / 100));
      return { discountAmount, finalAmount: price - discountAmount };
    }
    if (benefit.DISCOUNT_TYPE === 'AMOUNT') {
      const discountAmount = benefit.DISCOUNT_PRICE;
      return { discountAmount, finalAmount: price - discountAmount };
    }
    return { discountAmount: 0, finalAmount: price };
  };

  const getDiscountText = () => {
    if (!benefit) return null;
    if (benefit.DISCOUNT_TYPE === 'RATE')   return `${benefit.DISCOUNT_RATE}% 할인 적용`;
    if (benefit.DISCOUNT_TYPE === 'AMOUNT') return `${benefit.DISCOUNT_PRICE}원 할인 적용`;
    if (benefit.DISCOUNT_TYPE === 'POINT')  return `${benefit.POINT_AMOUNT}P 적립`;
    return null;
  };

  // ==============================================================
  //                        이벤트 정의
  // ==============================================================
  const handlePayment = (product) => {
    const { discountAmount, finalAmount } = calcDiscount(product.PRICE);
    router.push({
      pathname: '/(main)/payment',
      params: {
        product:        JSON.stringify(product),
        benefit:        JSON.stringify(benefit),
        cardId,
        cardType,
        cardName,
        storeName,
        discountAmount: String(discountAmount),
        finalAmount:    String(finalAmount),
      }
    });
  };

  // ==============================================================
  //                          화면 구성
  // ==============================================================
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{storeName} 상품 목록</Text>
      {getDiscountText() && (
        <Text style={styles.discountBadge}>{getDiscountText()}</Text>
      )}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {loading ? (
        <Text style={styles.loading}>로딩 중...</Text>
      ) : products.length === 0 ? (
        <Text style={styles.empty}>등록된 상품이 없습니다.</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.PRODUCT_ID}
          renderItem={({ item }) => {
            const { discountAmount, finalAmount } = calcDiscount(item.PRICE);
            return (
              <View style={styles.card}>
                <Text style={styles.productName}>{item.PRODUCT_NAME}</Text>
                <Text style={styles.description}>{item.DESCRIPTION}</Text>
                <View style={styles.priceRow}>
                  {discountAmount > 0 ? (
                    <Text style={styles.originalPrice}>{item.PRICE.toLocaleString()}원</Text>
                  ) : null}
                  {discountAmount > 0 ? (
                    <Text style={styles.discountPrice}>-{discountAmount.toLocaleString()}원</Text>
                  ) : null}
                </View>
                <Text style={styles.finalPrice}>
                  최종: {finalAmount.toLocaleString()}원
                </Text>
                <TouchableOpacity
                  style={styles.payButton}
                  onPress={() => handlePayment(item)}>
                  <Text style={styles.payButtonText}>결제하기</Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}>
        <Text style={styles.backButtonText}>뒤로</Text>
      </TouchableOpacity>
    </View>
  );
}