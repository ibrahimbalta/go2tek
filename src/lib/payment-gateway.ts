export interface PaymentAttemptInput {
  paymentMethod: 'PAYMENT_GATEWAY_IYZICO' | 'BANK_TRANSFER_EFT';
  amount: number;
  envConfig?: {
    iyzicoApiKey?: string;
    iyzicoSecretKey?: string;
  };
}

export interface PaymentAttemptResult {
  success: boolean;
  status:
    | 'GATEWAY_NOT_CONFIGURED'
    | 'PENDING_VERIFICATION'
    | 'VERIFIED_PAID'
    | 'REJECTED';
  userMessage: string;
  gatewayConfigured: boolean;
}

export function evaluatePaymentAttempt(
  input: PaymentAttemptInput
): PaymentAttemptResult {
  const apiKey = (
    input.envConfig?.iyzicoApiKey ??
    process.env.IYZICO_API_KEY ??
    ''
  ).trim();
  const secretKey = (
    input.envConfig?.iyzicoSecretKey ??
    process.env.IYZICO_SECRET_KEY ??
    ''
  ).trim();

  const gatewayConfigured = Boolean(apiKey && secretKey);

  if (input.paymentMethod === 'PAYMENT_GATEWAY_IYZICO') {
    if (!gatewayConfigured) {
      return {
        success: false,
        status: 'GATEWAY_NOT_CONFIGURED',
        gatewayConfigured: false,
        userMessage:
          'Ödeme kuruluşu (iyzico/PayTR) canlı API anahtarları henüz tanımlanmamıştır. Gerçek ödeme entegrasyonu aktif edilmeden kartlı ödeme başarılı olarak işlenemez. Lütfen Havale/EFT ile Ön Sipariş & Kapora Doğrulama seçeneğini kullanın.',
      };
    }

    // Even when keys are configured, actual 3D Secure callback verification is required before VERIFIED_PAID
    return {
      success: true,
      status: 'PENDING_VERIFICATION',
      gatewayConfigured: true,
      userMessage:
        'Ödeme kuruluşu 3D Secure doğrulama oturumu başlatıldı. Ödeme onayı gelene kadar işlem "Doğrulama Bekliyor" durumundadır.',
    };
  }

  return {
    success: true,
    status: 'PENDING_VERIFICATION',
    gatewayConfigured,
    userMessage:
      'Sipariş / Kapora talebiniz oluşturuldu. Ödemeniz banka dekontu / işlem referansı Go2Tek finans birimi tarafından doğrulandığında onaylanacaktır.',
  };
}

export function validateDepositVerification(params: {
  requestedStatus: string;
  verificationRef: string;
  depositAmount: number;
}): { allowed: boolean; error?: string } {
  if (params.requestedStatus === 'VERIFIED_PAID') {
    if (!params.depositAmount || params.depositAmount <= 0) {
      return {
        allowed: false,
        error:
          'Kapora tutarı 0 TL iken "Kapora Alındı / Doğrulandı" olarak işaretlenemez.',
      };
    }
    if (!params.verificationRef || params.verificationRef.trim().length < 4) {
      return {
        allowed: false,
        error:
          'Yetkili ödeme kuruluşu işlem numarası veya doğrulanmış banka dekont referansı girilmeden kapora "Ödendi" gösterilemez.',
      };
    }
  }
  return { allowed: true };
}
