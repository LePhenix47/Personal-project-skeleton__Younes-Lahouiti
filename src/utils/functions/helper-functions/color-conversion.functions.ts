import { round } from "./math.functions";
import { decimalToHexadecimal, hexadecimalToDecimal } from "./number.functions";
import { getSubtring, sliceString } from "./string.functions";

/**
 * Calculates the brightness of a color from its RGB values.
 *
 * @param {number} red - The red component of the color (0-255).
 * @param {number} blue - The blue component of the color (0-255).
 * @param {number} green - The green component of the color (0-255).
 * @param {boolean} hasToBeExact - Specifies whether the exact brightness should be calculated.
 *
 * If `true`, the [relative luminance formula](https://en.wikipedia.org/wiki/Relative_luminance) is used.
 *
 * If `false`, the average of the RGB values is used.
 *
 *
 * @returns {number} The brightness of the color.
 */
export function getColorBrightness(
  red: number,
  blue: number,
  green: number,
  hasToBeExact: boolean = true
): number {
  const hasInvalidRGBValues: boolean =
    red < 0 || red > 255 || blue < 0 || blue > 255 || green < 0 || green > 255;

  if (hasInvalidRGBValues) {
    throw "Unexpected error: One or multiple RGB values are overflowing or underflowing";
  }

  if (hasToBeExact) {
    const brightness: number = 0.2126 * red + 0.7152 * green + 0.0722 * blue;

    return brightness;
  }

  return (red + green + blue) / 3;
}

/**
 * Converts a Hexadecimal `#rrggbb` color value to RGB `rgb(red, green, blue)` format.
 *
 * @param {number} hexadecimal - The hexadecimal value of the color.
 *
 * @returns {string} The HSL color value.
 */
export function hexColorToRgb(hexadecimal: string): {
  red: number;
  green: number;
  blue: number;
} {
  const colorArgumentIsInvalid: boolean =
    hexadecimal?.length < 6 || hexadecimal?.length > 7;
  if (colorArgumentIsInvalid) {
    throw `Error: Unexpected color argument length passed, was expecting a 6 or 7 characters long string but instead got ${hexadecimal.length}`;
  }

  let hexColor: string = hexadecimal;

  const hasHashTag: boolean = hexadecimal.charAt(0) === "#";
  if (hasHashTag) {
    hexColor = sliceString(hexadecimal, 1);
  }

  let redBase16: string = getSubtring(hexColor, 0, 2);
  let greeBase16: string = getSubtring(hexColor, 2, 4);
  let blueBase16: string = getSubtring(hexColor, 4, 6);

  let base16NumbersArray: any[] = [redBase16, greeBase16, blueBase16];

  for (let i = 0; i < base16NumbersArray.length; i++) {
    let color: string = base16NumbersArray[i];
    base16NumbersArray[i] = hexadecimalToDecimal(color);
  }

  const redBase10: number = Number(base16NumbersArray[0]);
  const greenBase10: number = Number(base16NumbersArray[1]);
  const blueBase10: number = Number(base16NumbersArray[2]);

  return { red: redBase10, green: greenBase10, blue: blueBase10 };
}

/**
 * Converts an RGB (Red, Blue, Green) color value to HSL (Hue, Saturation, Lightness) format.
 *
 * @param {number} red - The red component of the RGB color (0-255).
 * @param {number} green - The green component of the RGB color (0-255).
 * @param {number} blue - The blue component of the RGB color (0-255).
 *
 * @returns {{hue: number; saturation: number; lightness: number;}} The HSL color value.
 */
export function rgbColorToHsl(
  red: number,
  green: number,
  blue: number
): {
  hue: number;
  saturation: number;
  lightness: number;
} {
  // Normalize RGB values
  const normalizedRed: number = red / 255;
  const normalizedGreen: number = green / 255;
  const normalizedBlue: number = blue / 255;

  // Find the maximum and minimum values of RGB
  const max: number = Math.max(normalizedRed, normalizedGreen, normalizedBlue);
  const min: number = Math.min(normalizedRed, normalizedGreen, normalizedBlue);

  const delta: number = max - min;
  // Calculate the lightness
  const lightness: number = (max + min) / 2;

  // Calculate the saturation
  let saturation: number;
  // Calculate the hue
  let hue: number;

  const isAchromatic: boolean = max === min;
  if (isAchromatic) {
    hue = 0; // achromatic (gray)
    saturation = 0;
  } else {
    saturation =
      lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    switch (max) {
      case normalizedRed: {
        hue =
          ((normalizedGreen - normalizedBlue) / delta +
            (normalizedGreen < normalizedBlue ? 6 : 0)) /
          6;
        break;
      }

      case normalizedGreen: {
        hue = ((normalizedBlue - normalizedRed) / delta + 2) / 6;
        break;
      }

      case normalizedBlue: {
        hue = ((normalizedRed - normalizedGreen) / delta + 4) / 6;
        break;
      }
    }
  }

  // Round the values and multiply saturation and lightness by 100
  const roundedHue: number = Math.round(hue * 360);
  const roundedSaturation: number = Math.round(saturation * 100);
  const roundedLightness: number = Math.round(lightness * 100);

  // Return the HSL color value as a string
  return {
    hue: roundedHue,
    saturation: roundedSaturation,
    lightness: roundedLightness,
  };
}

/**
 * Converts an HSL (Hue, Saturation, Lightness) color value to HEX (Hexadecimal) format.
 *
 * @param {number} hue - The hue value (0-360).
 * @param {number} saturation - The saturation value (0-100).
 * @param {number} lightness - The lightness value (0-100).
 *
 * @returns {string} The HEX color value.
 */
export function hslColorToHex(
  hue: number,
  saturation: number = 100,
  lightness: number = 50
): string {
  // Validate the HSL color values
  const hasInvalidHslArguments: boolean =
    hue < 0 ||
    hue > 360 ||
    saturation < 0 ||
    saturation > 100 ||
    lightness < 0 ||
    lightness > 100;
  if (hasInvalidHslArguments) {
    throw new Error(
      "Invalid HSL color values. Hue should be between 0 and 360, saturation and lightness should be between 0 and 100."
    );
  }

  // Normalize the HSL values
  const normalizedHue: number = hue / 360;
  const normalizedSaturation: number = saturation / 100;
  const normalizedLightness: number = lightness / 100;

  // Calculate the chroma value
  const chroma: number =
    (1 - Math.abs(2 * normalizedLightness - 1)) * normalizedSaturation;

  // Calculate the intermediate values
  const intermediateHue: number = normalizedHue * 6;
  const x: number = chroma * (1 - Math.abs((intermediateHue % 2) - 1));

  let red: number, green: number, blue: number;

  if (intermediateHue >= 0 && intermediateHue < 1) {
    [red, green, blue] = [chroma, x, 0];
  } else if (intermediateHue >= 1 && intermediateHue < 2) {
    [red, green, blue] = [x, chroma, 0];
  } else if (intermediateHue >= 2 && intermediateHue < 3) {
    [red, green, blue] = [0, chroma, x];
  } else if (intermediateHue >= 3 && intermediateHue < 4) {
    [red, green, blue] = [0, x, chroma];
  } else if (intermediateHue >= 4 && intermediateHue < 5) {
    [red, green, blue] = [x, 0, chroma];
  } else {
    [red, green, blue] = [chroma, 0, x];
  }

  // Calculate the lightness adjustment values
  const lightnessAdjustment: number = normalizedLightness - chroma / 2;

  // Scale the RGB values to the range of 0-255
  const scaledRed: number = Math.round((red + lightnessAdjustment) * 255);
  const scaledGreen: number = Math.round((green + lightnessAdjustment) * 255);
  const scaledBlue: number = Math.round((blue + lightnessAdjustment) * 255);

  // Convert the RGB values to hexadecimal strings using an imported function
  const redHex: string = decimalToHexadecimal(scaledRed).padStart(2, "0");
  const greenHex: string = decimalToHexadecimal(scaledGreen).padStart(2, "0");
  const blueHex: string = decimalToHexadecimal(scaledBlue).padStart(2, "0");

  // Combine the hexadecimal values and return the HEX color value
  return `#${redHex}${greenHex}${blueHex}`;
}

/**
 * Converts an HSL (Hue, Saturation, Lightness) color value to HWB (Hue, Whiteness, Blackness) format.
 *
 * @param {number} hue - The hue value (0-360).
 * @param {number} saturation - The saturation value (0-100).
 * @param {number} lightness - The lightness value (0-100).
 *
 * @returns {{hue: number; whiteness: number; blackness: number;}} The HWB color value.
 */
export function hslColorToHwb(
  hue: number,
  saturation: number = 100,
  lightness: number = 50
): {
  hue: number;
  whiteness: number;
  blackness: number;
} {
  const hasInvalidHslArguments: boolean =
    hue < 0 ||
    hue > 360 ||
    saturation < 0 ||
    saturation > 100 ||
    lightness < 0 ||
    lightness > 100;
  // Validate the HSL color values
  if (hasInvalidHslArguments) {
    throw new Error(
      "Invalid HSL color values. Hue should be between 0 and 360, saturation and lightness should be between 0 and 100."
    );
  }

  // Normalize the HSL values
  const normalizedHue: number = hue / 360;
  const normalizedSaturation: number = saturation / 100;
  const normalizedLightness: number = lightness / 100;

  // Calculate the maximum and minimum values
  const max: number = Math.max(normalizedSaturation, normalizedLightness);
  const min: number = Math.min(normalizedSaturation, normalizedLightness);

  // Calculate the hue, whiteness, and blackness values
  const hueValue: number = normalizedHue;
  const whiteness: number = 1 - max;
  const blackness: number = 1 - min;

  // Scale the values to the range of 0-100
  const scaledHue: number = Math.round(hueValue * 360);
  const scaledWhiteness: number = Math.round(whiteness * 100);
  const scaledBlackness: number = Math.round(blackness * 100);

  // Return the HWB color value as a string
  return {
    hue: scaledHue,
    whiteness: scaledWhiteness,
    blackness: scaledBlackness,
  };
}

/**
 * Converts an HWB (Hue-Whiteness-Blackness) color to HSV (Hue-Saturation-Value) color model.
 *
 * @param {number} hue - The hue value of the HWB color (0-360).
 * @param {number} whiteness - The whiteness value of the HWB color (0-100).
 * @param {number} blackness - The blackness value of the HWB color (0-100).
 *
 * @returns {Object} An object representing the converted HSV color with properties for hue, saturation, and value.
 */
export function hwbToHsv(
  hue: number,
  whiteness: number,
  blackness: number
): {
  hue: number;
  saturation: number;
  value: number;
} {
  const value: number = 1 - blackness;
  const saturation: number = 1 - whiteness / value;
  return {
    hue,
    saturation,
    value,
  };
}

/**
 * Converts HSV (Hue, Saturation, Value) color model to HSL (Hue, Saturation, Lightness) color model.
 * @param {number} hue - The hue value in degrees (0-360).
 * @param {number} saturation - The saturation value in percentage (0-100).
 * @param {number} value - The value/brightness value in percentage (0-100).
 * @returns {{ hue: number, saturation: number, lightness: number }} - The converted HSL color object.
 */
export function hsvToHsl(
  hue: number,
  saturation: number,
  value: number
): { hue: number; saturation: number; lightness: number } {
  //We normalize the value to get a range of numbers from 0 to 1
  const normalizedSaturation: number = saturation / 100;
  const normalizedValue: number = value / 100;

  //We use the formula: Lightness = (2 - Saturation) × (Value / 2)
  const convertedLightness: number =
    (2 - normalizedSaturation) * (normalizedValue / 2);

  //Depending on the lightness level we use slightly different formulas
  let convertedSaturation: number = 0;
  const hasLowBrightness: boolean = convertedLightness <= 0.5;
  if (hasLowBrightness) {
    //We use: Saturation = (Saturation × Value) / (2 × Lightness)
    convertedSaturation =
      (normalizedSaturation * normalizedValue) / (2 * convertedLightness);
  } else {
    //We use: Saturation = (Saturation × Value) / (2 - (2 × Lightness))
    convertedSaturation =
      (normalizedSaturation * normalizedValue) / (2 - 2 * convertedLightness);
  }

  //Given the fact that the saturation formula has a division with the lightness
  //We may have a division by 0 when the Lightness = 0% or 100% depending on the brightness level
  const hasMinOrMaxBrightness: boolean =
    convertedLightness === 0 || convertedLightness === 1;
  if (hasMinOrMaxBrightness) {
    convertedSaturation = 0;
  } else {
    convertedSaturation *= 100;
  }

  return {
    hue,
    saturation: convertedSaturation,
    lightness: convertedLightness * 100,
  };
}

/**
 * Transforms a color value from one color model to another.
 *
 * @param {any} colorValue - The color value to transform.
 * @param {string} initialColorModel - The initial color model of the color value, can be: `hex`, `rgb`,`hsl` or `hwb`
 * @param {string} wantedColorModel - The desired color model to convert the color value to, can be:  `hex`, `rgb` or `hsl`
 *
 * @example
 * let pinkHex = "#FF00BA";
 * let pinkRgb = transformColorModel(pinkHex, "hex","rgb")
 *
 * @returns {any} The transformed color value in the desired color model.
 */
export function transformColorModel(
  colorValue: any,
  initialColorModel: string,
  wantedColorModel: string
): any {
  let convertedColor: any;

  initialColorModel = initialColorModel.toLowerCase();
  wantedColorModel = wantedColorModel.toLowerCase();

  //Direct conversions
  const HEX_TO_RGB: boolean =
    initialColorModel.includes("hex") && wantedColorModel.includes("rgb");

  const RGB_TO_HSL: boolean =
    initialColorModel.includes("rgb") && wantedColorModel.includes("hsl");

  const HSL_TO_HEX: boolean =
    initialColorModel.includes("hsl") && wantedColorModel.includes("hex");

  const HSL_TO_HWB: boolean =
    initialColorModel.includes("hsl") && wantedColorModel.includes("hwb");

  const HWB_TO_HSV: boolean =
    initialColorModel.includes("hwb") && wantedColorModel.includes("hsv");

  const HSV_TO_HSL: boolean =
    initialColorModel.includes("hsv") && wantedColorModel.includes("hsl");

  //Indirect conversions
  const HSL_TO_RGB: boolean =
    initialColorModel.includes("hsl") && wantedColorModel.includes("rgb");
  const RGB_TO_HEX: boolean =
    initialColorModel.includes("rgb") && wantedColorModel.includes("hex");
  const HEX_TO_HSL: boolean =
    initialColorModel.includes("hex") && wantedColorModel.includes("hsl");

  // Direct Conversions (available color conversion funcitons)
  if (HEX_TO_RGB) {
    convertedColor = hexColorToRgb(colorValue);
  } else if (RGB_TO_HSL) {
    convertedColor = rgbColorToHsl(
      colorValue.red,
      colorValue.green,
      colorValue.blue
    );
  } else if (HSL_TO_HEX) {
    convertedColor = hslColorToHex(
      colorValue.hue,
      colorValue.saturation,
      colorValue.lightness
    );
  } else if (HSL_TO_HWB) {
    convertedColor = hslColorToHwb(
      colorValue.hue,
      colorValue.saturation,
      colorValue.lightness
    );
  } else if (HWB_TO_HSV) {
    convertedColor = hwbToHsv(
      colorValue.hue,
      colorValue.whiteness,
      colorValue.blackness
    );
  } else if (HSV_TO_HSL) {
    convertedColor = hsvToHsl(
      colorValue.hue,
      colorValue.saturation,
      colorValue.value
    );
  }

  // Indirect Conversions (incomplete)
  else if (HSL_TO_RGB) {
    const hexColor: string = hslColorToHex(
      colorValue.hue,
      colorValue.saturation,
      colorValue.lightness
    );
    convertedColor = hexColorToRgb(hexColor);
  } else if (RGB_TO_HEX) {
    const hslColor: {
      hue: number;
      saturation: number;
      lightness: number;
    } = rgbColorToHsl(colorValue.red, colorValue.green, colorValue.blue);
    convertedColor = hslColorToHex(
      hslColor.hue,
      hslColor.saturation,
      hslColor.lightness
    );
  } else if (HEX_TO_HSL) {
    const rgbColor: {
      red: number;
      green: number;
      blue: number;
    } = hexColorToRgb(colorValue);
    convertedColor = rgbColorToHsl(rgbColor.red, rgbColor.green, rgbColor.blue);
  }

  // Unsupported Conversion
  else {
    throw new Error(
      "Color model conversion error: Unsupported wanted color model"
    );
  }

  return convertedColor;
}
