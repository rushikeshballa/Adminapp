import * as ImagePicker from 'expo-image-picker';
import { Platform, Alert } from 'react-native';

export interface PickImageOptions {
  aspect?: [number, number];
  quality?: number;
  maxDimension?: number;
}

/**
 * Converts a blob URI to base64 Data URL (essential on web because blob: URLs expire upon page refresh)
 */
async function blobToDataUrl(blobUrl: string): Promise<string> {
  try {
    const res = await fetch(blobUrl);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.warn('Failed to convert blob to data url:', err);
    return blobUrl;
  }
}

/**
 * Resizes and compresses image on web using an offscreen canvas
 * This ensures AsyncStorage (localStorage on web) never exceeds its quota with huge camera files.
 */
function compressImageWeb(
  dataUrl: string,
  maxDimension = 900,
  quality = 0.75
): Promise<string> {
  if (typeof window === 'undefined' || !window.Image) {
    return Promise.resolve(dataUrl);
  }

  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      let { width, height } = img;
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

/**
 * Pick an image from device gallery / local file picker
 */
export async function pickImageFromGallery(
  options: PickImageOptions = {}
): Promise<string | null> {
  try {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Needed',
          'Media library permission is required to select photos from your device.'
        );
        return null;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: options.aspect,
      quality: options.quality ?? 0.75,
      base64: true,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return null;
    }

    const asset = result.assets[0];
    let finalUri = asset.uri;

    if (asset.base64) {
      const mime = asset.mimeType || 'image/jpeg';
      finalUri = `data:${mime};base64,${asset.base64}`;
    } else if (Platform.OS === 'web' && finalUri.startsWith('blob:')) {
      finalUri = await blobToDataUrl(finalUri);
    }

    if (Platform.OS === 'web' && finalUri.startsWith('data:')) {
      finalUri = await compressImageWeb(
        finalUri,
        options.maxDimension ?? 900,
        options.quality ?? 0.75
      );
    }

    return finalUri;
  } catch (error) {
    console.error('Error picking image from gallery:', error);
    Alert.alert('Upload Failed', 'Unable to pick image. Please try again.');
    return null;
  }
}

/**
 * Capture photo using device camera
 */
export async function capturePhotoWithCamera(
  options: PickImageOptions = {}
): Promise<string | null> {
  try {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Needed',
          'Camera permission is required to capture photos.'
        );
        return null;
      }
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: options.aspect,
      quality: options.quality ?? 0.75,
      base64: true,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return null;
    }

    const asset = result.assets[0];
    let finalUri = asset.uri;

    if (asset.base64) {
      const mime = asset.mimeType || 'image/jpeg';
      finalUri = `data:${mime};base64,${asset.base64}`;
    } else if (Platform.OS === 'web' && finalUri.startsWith('blob:')) {
      finalUri = await blobToDataUrl(finalUri);
    }

    if (Platform.OS === 'web' && finalUri.startsWith('data:')) {
      finalUri = await compressImageWeb(
        finalUri,
        options.maxDimension ?? 900,
        options.quality ?? 0.75
      );
    }

    return finalUri;
  } catch (error) {
    console.error('Error capturing photo with camera:', error);
    Alert.alert('Camera Failed', 'Unable to access camera. Please try again.');
    return null;
  }
}
