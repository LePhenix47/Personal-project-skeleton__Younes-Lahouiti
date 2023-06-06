import { log } from "./utils/functions/helper-functions/console.functions";

import { getAllColorModelsFromHex } from "./utils/functions/helper-functions/color-conversion.functions";

//Web components
import "./components/web-component.component";

log("Hello world!");

// log(transformColorModel({ red: 255, blue: 255, green: 255 }, "rgb", "hsv"));
log(getAllColorModelsFromHex("#33374a"));
