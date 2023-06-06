import {
  decimalToHexadecimal,
  hexadecimalToDecimal,
} from "../../functions/helper-functions/number.functions";
import {
  sliceString,
  getSubtring,
} from "../../functions/helper-functions/string.functions";
import {
  HueSaturationLightness,
  HueSaturationValue,
  HueWhitenessBlackness,
  RedGreenBlue,
} from "../../variables/color-types.variables";

export class ColorsConverterMethods {
  color:
    | string
    | RedGreenBlue
    | HueSaturationLightness
    | HueWhitenessBlackness
    | HueSaturationValue;

  constructor(
    newColor:
      | string
      | RedGreenBlue
      | HueSaturationLightness
      | HueWhitenessBlackness
      | HueSaturationValue
  ) {
    this.color = newColor;
  }

  fromRgbToHex(): string {
    this.color = this.color as RedGreenBlue;
    const { red, green, blue } = this.color;

    const hexadecimalRed: string = decimalToHexadecimal(red);
    const hexadecimalGreen: string = decimalToHexadecimal(green);
    const hexadecimalBlue: string = decimalToHexadecimal(blue);

    return `#${hexadecimalRed}${hexadecimalGreen}${hexadecimalBlue};`;
  }

  fromHexToRgb(): RedGreenBlue {
    this.color = this.color as string;

    const colorArgumentIsInvalid: boolean =
      this.color?.length < 6 || this.color?.length > 7;
    if (colorArgumentIsInvalid) {
      console.error(
        `Error: Unexpected color argument length passed, was expecting a 6 or 7 characters long string but instead got ${this.color.length}`
      );
    }

    let hexColor: string = this.color;

    const hasHashTag: boolean = this.color.charAt(0) === "#";
    if (hasHashTag) {
      hexColor = sliceString(this.color, 1);
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

  fromRgbToHsl(): HueSaturationLightness {
    this.color = this.color as RedGreenBlue;
    const { red, green, blue } = this.color;

    const argumentsAreInvalid: boolean =
      !Number.isInteger(red) ||
      !Number.isInteger(green) ||
      !Number.isInteger(blue) ||
      red < 0 ||
      red > 255 ||
      green < 0 ||
      green > 255 ||
      blue < 0 ||
      blue > 255;
    if (argumentsAreInvalid) {
      console.error(
        `Invalid RGB color values. Expected integers between 0 and 255, but received: red=${red}, green=${green}, blue=${blue}`
      );
    }

    // Normalize RGB values
    const normalizedRed: number = red / 255;
    const normalizedGreen: number = green / 255;
    const normalizedBlue: number = blue / 255;

    // Find the maximum and minimum values of RGB
    const max: number = Math.max(
      normalizedRed,
      normalizedGreen,
      normalizedBlue
    );
    const min: number = Math.min(
      normalizedRed,
      normalizedGreen,
      normalizedBlue
    );

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
      hue: roundedHue % 360,
      saturation: roundedSaturation,
      lightness: roundedLightness,
    };
  }

  fromHslToRgb(): RedGreenBlue {
    this.color = this.color as HueSaturationLightness;
    const { hue, saturation, lightness } = this.color;

    const normalizedSaturation: number = saturation / 100;
    const normalizedLightness: number = lightness / 100;

    function calculateComponent(colorValue: number): number {
      const colorComponent: number = (colorValue + hue / 30) % 12;
      const chroma: number =
        normalizedSaturation *
        Math.min(normalizedLightness, 1 - normalizedLightness);
      return (
        lightness -
        chroma *
          Math.max(-1, Math.min(colorComponent - 3, 9 - colorComponent, 1))
      );
    }

    return {
      red: calculateComponent(0),
      green: calculateComponent(8),
      blue: calculateComponent(4),
    };
  }

  fromRgbToHwb(): HueWhitenessBlackness {
    this.color = this.color as RedGreenBlue;
    const { red, green, blue } = this.color;

    const normalizedRed: number = red / 255;
    const normalizedGreen: number = green / 255;
    const normalizedBlue: number = blue / 255;

    const { hue } = this.fromRgbToHsl();

    const whiteness: number = Math.min(
      normalizedRed,
      normalizedGreen,
      normalizedBlue
    );
    const blackness: number =
      1 - Math.max(normalizedRed, normalizedGreen, normalizedBlue);

    return {
      hue: hue % 360,
      whiteness: Math.round(whiteness * 100),
      blackness: Math.round(blackness * 100),
    };
  }

  fromHwbToRgb(): RedGreenBlue {
    this.color = this.color as HueWhitenessBlackness;
    const { hue, whiteness, blackness } = this.color;

    const normalizedWhiteness: number = whiteness / 100;
    const normalizedBlackness: number = blackness / 100;

    const isGrey: boolean = normalizedWhiteness + normalizedBlackness >= 1;
    if (isGrey) {
      const greyColor: number =
        normalizedWhiteness / (normalizedWhiteness + normalizedBlackness);

      return {
        red: Math.round(greyColor * 100),
        green: Math.round(greyColor * 100),
        blue: Math.round(greyColor * 100),
      };
    }
    const { red, green, blue } = this.fromHslToRgb();

    const calculatedRed: number =
      red * (1 - normalizedWhiteness - normalizedBlackness) +
      normalizedWhiteness;
    const calculatedGreen: number =
      green * (1 - normalizedWhiteness - normalizedBlackness) +
      normalizedWhiteness;
    const calculatedBlue: number =
      blue * (1 - normalizedWhiteness - normalizedBlackness) +
      normalizedWhiteness;

    return {
      red: Math.round(calculatedRed * 100),
      green: Math.round(calculatedGreen * 100),
      blue: Math.round(calculatedBlue * 100),
    };
  }

  fromRgbToHsv(): HueSaturationValue {
    this.color = this.color as RedGreenBlue;
    const { red, green, blue } = this.color;

    const min: number = Math.min(red, green, blue);
    const max: number = Math.max(red, green, blue);

    const { hue } = this.fromRgbToHsl();

    const normalizedSaturation: number = max !== 0 ? 1 - min / max : 0;
    const normalizedValue: number = max / 255;

    return {
      hue: hue % 360,
      saturation: Math.round(normalizedSaturation * 100),
      value: Math.round(normalizedValue * 100),
    };
  }

  fromHsvToRgb(): RedGreenBlue {
    this.color = this.color as HueSaturationValue;
    const { hue, saturation, value } = this.color;

    // Normalize saturation and value to the range of 0-1
    const normalizedSaturation = saturation / 100;
    const normalizedValue = value / 100;

    // Calculate intermediate values
    const chroma: number = normalizedValue * normalizedSaturation;
    const hueSegment: number = hue / 60;
    const intermediate: number = chroma * (1 - Math.abs((hueSegment % 2) - 1));
    const lightnessAdjustment: number = normalizedValue - chroma;

    let normalizedRed: number;
    let normalizedGreen: number;
    let normalizedBlue: number;

    // Determine the RGB values based on the hue segment
    if (hueSegment >= 0 && hueSegment < 1) {
      normalizedRed = chroma;
      normalizedGreen = intermediate;
      normalizedBlue = 0;
    } else if (hueSegment >= 1 && hueSegment < 2) {
      normalizedRed = intermediate;
      normalizedGreen = chroma;
      normalizedBlue = 0;
    } else if (hueSegment >= 2 && hueSegment < 3) {
      normalizedRed = 0;
      normalizedGreen = chroma;
      normalizedBlue = intermediate;
    } else if (hueSegment >= 3 && hueSegment < 4) {
      normalizedRed = 0;
      normalizedGreen = intermediate;
      normalizedBlue = chroma;
    } else if (hueSegment >= 4 && hueSegment < 5) {
      normalizedRed = intermediate;
      normalizedGreen = 0;
      normalizedBlue = chroma;
    } else {
      normalizedRed = chroma;
      normalizedGreen = 0;
      normalizedBlue = intermediate;
    }

    // Adjust the RGB values by adding the calculated intermediate values
    normalizedRed += lightnessAdjustment;
    normalizedGreen += lightnessAdjustment;
    normalizedBlue += lightnessAdjustment;

    // Return the resulting RGB values in the range of 0-255
    return {
      red: Math.round(normalizedRed * 100),
      green: Math.round(normalizedGreen * 100),
      blue: Math.round(normalizedBlue * 100),
    };
  }
}

export class ColorConverter extends ColorsConverterMethods {
  color:
    | string
    | RedGreenBlue
    | HueSaturationLightness
    | HueWhitenessBlackness
    | HueSaturationValue;
  currentModel: string;

  constructor(
    currentModel: string,
    color:
      | string
      | RedGreenBlue
      | HueSaturationLightness
      | HueWhitenessBlackness
      | HueSaturationValue
  ) {
    super(color);
    this.color = color;

    this.currentModel = currentModel;
  }

  normalizeToRgb() {}

  convert(toModel) {}
}
