import SettingsManager from "common/classes/settings";
import config from "./package.json";

const settings = new SettingsManager(config.info.name);

export default settings;