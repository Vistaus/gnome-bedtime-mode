"use strict";

const { GLib, Gio } = imports.gi;

const { extensionUtils } = imports.misc;

const Me = extensionUtils.getCurrentExtension();
const Config = Me.imports.config;

const [major] = imports.misc.config.PACKAGE_VERSION.split(".");

var ShellVersion = Number.parseInt(major);

/**
 * Output a debug message to the console if the debug config is active.
 *
 * @param {string} message The message to log.
 */
function logDebug(message) {
  if (Config.debug) log(`[DEBUG] ${Me.metadata.name}: ${message}`);
}

/**
 * @returns The Preferences ui file.
 */
function getPreferencesUiFile() {
  return GLib.build_filenamev([Me.path, "ui", "gtk4", "preferences.ui"]);
}

/**
 * This runs in a loop the provided function at the specified interval.
 *
 * The loop is active until the function returns true.
 * Otherwise (false/no return/other return value) the loop is stopped.
 *
 * @param {*} func The function to loop at the specified interval
 * @param {*} interval The time in ms at which to call the function
 * @param  {...any} args Optional arguments to the function
 * @returns The corresponding GLib.Source object which needs be destroyed later on
 */
function loopRun(func, interval, ...args) {
  const wrappedFunc = () => {
    return func.apply(this, args);
  };

  const loopSourceId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, interval, wrappedFunc);
  return GLib.main_context_default().find_source_by_id(loopSourceId);
}

/**
 * @returns The Gio.Icon object constructed from the proper extension's svg icon path.
 */
function getExtensionIcon() {
  return Gio.icon_new_for_string(GLib.build_filenamev([Me.path, "icons", "status", "bedtime-mode-symbolic.svg"]));
}
