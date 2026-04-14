import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { WebView } from 'react-native-webview';
import api from '../../api/axios';

export default function PaymentScreen() {

  // ==============================================================
  //                        변수 정의
  // ==============================================================
  const router = useRouter();
  const {
    product: productStr,
    benefit: benefitStr,
    cardId, cardType, cardName,
    storeName, discountAmount, finalAmount
  } = useLocalSearchParams();

  const product = productStr ? JSON.parse(productStr) : null;
  const benefit = benefitStr ? JSON.parse(benefitStr) : null;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [webViewUrl, setWebViewUrl] = useState(null);
  const [tid, setTid] = useState(null);
  const [partnerOrderId, setPartnerOrderId] = useState(null);

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, paddingTop: 60 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    card: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 20, marginBottom: 16 },
    infoTitle: { fontWeight: 'bold', fontSize: 18, marginBottom: 16 },
    row: { borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 12, marginBottom: 12 },
    label: { color: '#666', fontSize: 14 },
    value: { fontWeight: 'bold', fontSize: 15, marginTop: 2 },
    discountValue: { fontWeight: 'bold', fontSize: 15, color: '#E24B4A', marginTop: 2 },
    finalValue: { fontWeight: 'bold', fontSize: 22, color: '#4A90E2', marginTop: 2 },
    error: { color: 'red', marginBottom: 12, textAlign: 'center' },
    payButton: { backgroundColor: '#FAE100', padding: 14, borderRadius: 8, alignItems: 'center', marginBottom: 8 },
    payButtonText: { color: '#333', fontWeight: 'bold', fontSize: 16 },
    cancelButton: { borderWidth: 1, borderColor: '#ccc', padding: 14, borderRadius: 8, alignItems: 'center' },
    cancelButtonText: { color: '#666' },
    webViewContainer: { flex: 1 },
  });

  // ==============================================================
  //                        이벤트 정의
  // ==============================================================
  const handlePayment = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.post('/api/payments/ready', {
        benefitId:      benefit?.BENEFIT_ID || 'NONE',
        cardId:         cardId,
        itemName:       product.PRODUCT_NAME,
        amount:         product.PRICE,
        discountAmount: Number(discountAmount) || 0,
        approvalUrl:    `${API_URL}/payment/success`,
        cancelUrl:      `${API_URL}/payment/cancel`,
        failUrl:        `${API_URL}/payment/fail`,
      });

      const { nextRedirectMobileUrl, tid: resTid, partnerOrderId: resOrderId } = response.data;
      setTid(resTid);
      setPartnerOrderId(resOrderId);
      setWebViewUrl(nextRedirectMobileUrl);

    } catch (err) {
      setError(err.response?.data?.message || '결제 준비 실패');
    } finally {
      setLoading(false);
    }
  };

  // ==============================================================
  //                        WebView URL 변경 감지
  // ==============================================================
  const handleNavigationChange = (navState) => {
    const { url } = navState;
    console.log('WebView URL 변경:', url);

    if (url.includes('/payment/success')) {
      const pgToken = url.split('pg_token=')[1];
      if (pgToken) {
        setWebViewUrl(null);
        approvePayment(pgToken);
      }
    }

    if (url.includes('/payment/cancel')) {
      setWebViewUrl(null);
      setError('결제가 취소되었습니다.');
    }

    if (url.includes('/payment/fail')) {
      setWebViewUrl(null);
      setError('결제에 실패했습니다.');
    }
  };

  const approvePayment = async (pgToken) => {
    try {
      await api.post('/api/payments/approve', {
        pgToken,
        tid,
        partnerOrderId,
      });
      router.replace('/(main)/paymentcomplete');
    } catch (err) {
      setError(err.response?.data?.message || '결제 승인 실패');
    }
  };

  // ==============================================================
  //                          화면 구성
  // ==============================================================
  if (webViewUrl) {
    return (
      <View style={styles.webViewContainer}>
        <WebView
          source={{ uri: webViewUrl }}
          originWhitelist={['*', 'intent://', 'kakaotalk://']}
          onNavigationStateChange={handleNavigationChange}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onError={(e) => console.log('WebView 에러:', e.nativeEvent)}
          onHttpError={(e) => console.log('WebView HTTP 에러:', e.nativeEvent)}
          onShouldStartLoadWithRequest={(request) => {
            const { url } = request;
            console.log('onShouldStartLoadWithRequest 호출:', url);

            if (url.startsWith('intent://')) {
              console.log('intent:// 감지!');
              // intent URL 파싱 → kakaotalk:// 스킴으로 변환
              const intentPath = url.replace('intent://', '').split('#Intent')[0];
              const kakaoUrl = 'kakaotalk://' + intentPath;
              console.log('변환된 URL:', kakaoUrl);
              Linking.openURL(kakaoUrl).catch((e) => {
                console.log('kakaotalk 열기 실패:', e);
              });
              return false;
            }

            if (url.startsWith('kakaotalk://')) {
              console.log('kakaotalk:// 감지!');
              Linking.openURL(url).catch((e) => {
                console.log('kakaotalk 열기 실패:', e);
              });
              return false;
            }

            return true;
          }}
          injectedJavaScript={`
            (function() {
              window.ReactNativeWebView.postMessage(JSON.stringify({type: 'TEST', message: 'injected 실행됨'}));

              var originalOpen = window.open;
              window.open = function(url) {
                window.ReactNativeWebView.postMessage(JSON.stringify({type: 'OPEN_URL', url: url}));
                if (url && (url.startsWith('intent://') || url.startsWith('kakaotalk://'))) {
                  return;
                }
                return originalOpen.apply(this, arguments);
              };

              var originalDescriptor = Object.getOwnPropertyDescriptor(window.location, 'href');
              Object.defineProperty(window.location, 'href', {
                set: function(url) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({type: 'LOCATION_HREF', url: url}));
                  if (url && (url.startsWith('intent://') || url.startsWith('kakaotalk://'))) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({type: 'OPEN_URL', url: url}));
                    return;
                  }
                  if (originalDescriptor && originalDescriptor.set) {
                    originalDescriptor.set.call(this, url);
                  }
                },
                get: function() {
                  if (originalDescriptor && originalDescriptor.get) {
                    return originalDescriptor.get.call(this);
                  }
                }
              });
            })();
          `}
          onMessage={(event) => {
            const data = JSON.parse(event.nativeEvent.data);
            console.log('postMessage 수신:', data);
            if (data.type === 'OPEN_URL') {
              console.log('OPEN_URL 처리:', data.url);
              Linking.openURL(data.url).catch((e) => {
                console.log('열기 실패:', e);
              });
            }
          }}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>결제</Text>
      <View style={styles.card}>
        <Text style={styles.infoTitle}>결제 정보</Text>

        <View style={styles.row}>
          <Text style={styles.label}>카드</Text>
          <Text style={styles.value}>{cardName}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>매장</Text>
          <Text style={styles.value}>{storeName}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>상품</Text>
          <Text style={styles.value}>{product?.PRODUCT_NAME}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>정가</Text>
          <Text style={styles.value}>{Number(product?.PRICE).toLocaleString()}원</Text>
        </View>

        {Number(discountAmount) > 0 && (
          <View style={styles.row}>
            <Text style={styles.label}>할인</Text>
            <Text style={styles.discountValue}>-{Number(discountAmount).toLocaleString()}원</Text>
          </View>
        )}

        <View style={{ marginBottom: 8 }}>
          <Text style={styles.label}>최종 결제 금액</Text>
          <Text style={styles.finalValue}>{Number(finalAmount).toLocaleString()}원</Text>
        </View>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity
        style={styles.payButton}
        onPress={handlePayment}
        disabled={loading}>
        <Text style={styles.payButtonText}>
          {loading ? '처리 중...' : '카카오페이로 결제'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => router.back()}>
        <Text style={styles.cancelButtonText}>취소</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}