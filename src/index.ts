import { log } from "./utils/functions/helper-functions/console.functions";

import { getAllColorModelsFromHex } from "./utils/functions/helper-functions/color-conversion.functions";

//Web components
import "./components/web-component.component";
import { ColorConverter } from "./utils/classes/services/color-converter-service.class";

log("Hello world!");

// log(getAllColorModelsFromHex("#33374a"));

const colorConverter = new ColorConverter("hex", "#406273");
log("%c" + colorConverter.color, "color:#8974c6");
log(colorConverter.convertTo("rgb"));
log(colorConverter.convertTo("hsl"));
log(colorConverter.convertTo("hwb"));
log(colorConverter.convertTo("hsv"));
