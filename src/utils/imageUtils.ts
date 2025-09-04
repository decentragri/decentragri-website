/**
 * Utility functions for handling farm images
 */

/**
 * Converts imageBytes array to a base64 data URL for rendering
 * @param imageBytes - Array of numbers OR base64 string representing the packed byte array from server
 * @returns Base64 data URL string or DecentrAgri logo path as fallback
 */
export const convertImageBytesToDataUrl = (imageBytes: number[] | string): string => {
  console.log('convertImageBytesToDataUrl called with:', {
    hasImageBytes: !!imageBytes,
    length: typeof imageBytes === 'string' ? imageBytes.length : imageBytes?.length || 0,
    type: typeof imageBytes,
    isArray: Array.isArray(imageBytes),
    firstFewChars: typeof imageBytes === 'string' ? imageBytes.substring(0, 10) : 'not string',
    firstFewBytes: Array.isArray(imageBytes) ? imageBytes?.slice(0, 10) : 'not array'
  });

  if (!imageBytes || (Array.isArray(imageBytes) && imageBytes.length === 0) || (typeof imageBytes === 'string' && imageBytes.length === 0)) {
    console.log('No imageBytes available, using DecentrAgri logo');
    return '/assets/img/logo/decentra_logo2.png';
  }

  try {
    let base64String: string;

    if (typeof imageBytes === 'string') {
      // If it's already a base64 string, use it directly
      console.log('ImageBytes is a string, treating as base64');
      base64String = imageBytes;
    } else {
      // If it's a number array, convert to base64
      console.log('ImageBytes is an array, converting to base64');
      const uint8Array = new Uint8Array(imageBytes);
      console.log('Created Uint8Array:', {
        length: uint8Array.length,
        firstFewBytes: Array.from(uint8Array.slice(0, 10))
      });
      
      base64String = btoa(String.fromCharCode.apply(null, Array.from(uint8Array)));
    }
    
    console.log('Base64 conversion successful, length:', base64String.length);
    
    // Detect image format from base64 header
    let mimeType = 'image/jpeg'; // default
    if (base64String.startsWith('iVBORw0KGgo')) {
      mimeType = 'image/png';
    } else if (base64String.startsWith('/9j/')) {
      mimeType = 'image/jpeg';
    } else if (base64String.startsWith('R0lGOD')) {
      mimeType = 'image/gif';
    } else if (base64String.startsWith('UklGR')) {
      mimeType = 'image/webp';
    }
    
    // Return as data URL
    const dataUrl = `data:${mimeType};base64,${base64String}`;
    console.log('Generated data URL with MIME type:', mimeType, 'first 100 chars:', dataUrl.substring(0, 100) + '...');
    return dataUrl;
  } catch (error) {
    console.error('Error converting imageBytes to base64:', error);
    return '/assets/img/logo/decentra_logo2.png';
  }
};

/**
 * Gets the appropriate image source for a farm, prioritizing imageBytes over URL
 * @param imageBytes - Array of numbers OR base64 string representing the packed byte array
 * @param imageUrl - Fallback URL string (deprecated)
 * @returns Object with image source string and whether it's a fallback logo
 */
export const getFarmImageSrc = (imageBytes: number[] | string, imageUrl?: string): { src: string; isLogo: boolean } => {
  console.log('getFarmImageSrc called with:', {
    hasImageBytes: !!imageBytes,
    imageBytesLength: typeof imageBytes === 'string' ? imageBytes.length : imageBytes?.length || 0,
    imageBytesType: typeof imageBytes,
    hasImageUrl: !!imageUrl,
    imageUrl: imageUrl
  });

  // Prioritize imageBytes if available
  if (imageBytes && ((Array.isArray(imageBytes) && imageBytes.length > 0) || (typeof imageBytes === 'string' && imageBytes.length > 0))) {
    console.log('Using imageBytes for image source');
    return { src: convertImageBytesToDataUrl(imageBytes), isLogo: false };
  }
  
  // Fallback to URL if no imageBytes (for backward compatibility)
  if (imageUrl && imageUrl !== '') {
    console.log('Using image URL for image source:', imageUrl);
    return { src: imageUrl, isLogo: false };
  }
  
  // Final fallback to placeholder
  console.log('Using DecentrAgri logo as fallback');
  return { src: '/assets/img/logo/decentra_logo2.png', isLogo: true };
};
