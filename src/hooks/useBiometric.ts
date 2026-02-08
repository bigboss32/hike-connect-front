import { Capacitor } from '@capacitor/core';

interface BiometricResult {
  isAvailable: boolean;
  biometryType?: string;
}

export const useBiometric = () => {

  // ===============================
  // Detectar plataforma nativa
  // ===============================
  const isNativePlatform = (): boolean => {
    return Capacitor.isNativePlatform();
  };

  // ===============================
  // Verificar biometría disponible
  // ===============================
  const checkBiometricAvailability = async (): Promise<BiometricResult> => {
    console.log("🔐 Verificando disponibilidad de biometría...");

    if (!isNativePlatform()) {
      console.log("⚠️ Navegador web - biometría NO disponible");
      return { isAvailable: false };
    }

    try {
      const { BiometricAuth } = await import('@aparajita/capacitor-biometric-auth');

      const result = await BiometricAuth.checkBiometry();

      console.log("✅ Resultado checkBiometry:", result);

      return {
        isAvailable: result.isAvailable,
        biometryType: result.biometryType,
      };

    } catch (error) {
      console.error('❌ Error en checkBiometry:', error);
      return { isAvailable: false };
    }
  };

  // ===============================
  // Autenticar con biometría
  // ===============================
  const authenticateWithBiometric = async (
    reason: string = 'Autenticarse'
  ): Promise<boolean> => {

    console.log("🔐 Intentando autenticación biométrica...");

    if (!isNativePlatform()) {
      console.log("⚠️ Navegador web");
      return false;
    }

    try {
      const { BiometricAuth } = await import('@aparajita/capacitor-biometric-auth');

      await BiometricAuth.authenticate({
        reason,
        cancelTitle: 'Cancelar',
        allowDeviceCredential: true,
        iosFallbackTitle: 'Usar contraseña',
        androidTitle: 'Autenticación biométrica',
        androidSubtitle: 'Verifica tu identidad',
        androidConfirmationRequired: false,
      });

      console.log("✅ Autenticación exitosa");
      return true;

    } catch (error) {
      console.error('❌ Error en autenticación:', error);
      return false;
    }
  };

  // ===============================
  // Guardar credenciales
  // ===============================
  const saveBiometricCredentials = async (
    email: string,
    password: string
  ): Promise<boolean> => {

    console.log("💾 Guardando credenciales biométricas...");

    if (!isNativePlatform()) return false;

    try {
      const { SecureStorage } = await import('@aparajita/capacitor-secure-storage');

      await SecureStorage.set('biometric_email', email);
      await SecureStorage.set('biometric_password', password);
      await SecureStorage.set('biometric_enabled', true);

      console.log("✅ Credenciales guardadas");

      return true;

    } catch (error) {
      console.error('❌ Error guardando credenciales:', error);
      return false;
    }
  };

  // ===============================
  // Obtener credenciales
  // ===============================
  const getBiometricCredentials = async (): Promise<{
    email: string;
    password: string;
  } | null> => {

    console.log("📖 Obteniendo credenciales biométricas...");

    if (!isNativePlatform()) return null;

    try {
      const { SecureStorage } = await import('@aparajita/capacitor-secure-storage');

      const email = await SecureStorage.get('biometric_email');
      const password = await SecureStorage.get('biometric_password');

      if (email && password) {
        return { email, password };
      }

      return null;

    } catch (error) {
      console.error('❌ Error obteniendo credenciales:', error);
      return null;
    }
  };

  // ===============================
  // Verificar si está habilitado
  // ===============================
  const isBiometricEnabled = async (): Promise<boolean> => {

    console.log("🔍 Verificando biometría habilitada...");

    if (!isNativePlatform()) return false;

    try {
      const { SecureStorage } = await import('@aparajita/capacitor-secure-storage');

      const value = await SecureStorage.get('biometric_enabled');

      return value === true || value === 'true';

    } catch (error) {
      console.error('❌ Error verificando biometría:', error);
      return false;
    }
  };

  // ===============================
  // Deshabilitar biometría
  // ===============================
  const disableBiometric = async (): Promise<boolean> => {

    console.log("🗑️ Deshabilitando biometría...");

    if (!isNativePlatform()) return false;

    try {
      const { SecureStorage } = await import('@aparajita/capacitor-secure-storage');

      await SecureStorage.remove('biometric_email');
      await SecureStorage.remove('biometric_password');
      await SecureStorage.remove('biometric_enabled');

      console.log("✅ Biometría deshabilitada");

      return true;

    } catch (error) {
      console.error('❌ Error deshabilitando biometría:', error);
      return false;
    }
  };

  // ===============================
  // API pública del hook
  // ===============================
  return {
    checkBiometricAvailability,
    authenticateWithBiometric,
    saveBiometricCredentials,
    getBiometricCredentials,
    isBiometricEnabled,
    disableBiometric,
  };
};
