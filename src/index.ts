import { log } from "./utils/functions/helper-functions/console.functions";

//Web components
import "./components/web-component.component";
import { ColorConverter } from "./utils/classes/services/color-converter-service.class";
import {
  parseToJS,
  stringifyToJSON,
} from "./utils/functions/helper-functions/string.functions";

log("Hello world!");

// log(getAllColorModelsFromHex("#33374a"));

const colorConverter = new ColorConverter("hsl", {
  hue: 200,
  saturation: 28,
  lightness: 35,
});

const currentColor = stringifyToJSON(colorConverter.color);

log("%c" + currentColor, "color:#8974c6");
log(colorConverter.convertTo("hwb"));
log(colorConverter.convertTo("hsv"));
