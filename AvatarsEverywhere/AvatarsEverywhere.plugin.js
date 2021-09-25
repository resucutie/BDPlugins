/**
 * @name AvatarsEverywhere
 * @author A user
 * @version 0.0.1
 * @description Applys users avatar in different places
 * @source https://github.com/abUwUser/BDPlugins/tree/main/plugins/AvatarsEverywhere
 * @updateUrl https://raw.githubusercontent.com/abUwUser/BDPlugins/compiled/AvatarsEverywhere/AvatarsEverywhere.plugin.js
 */
/*@cc_on
@if (@_jscript)
    
    // Offer to self-install for clueless users that try to run this directly.
    var shell = WScript.CreateObject("WScript.Shell");
    var fs = new ActiveXObject("Scripting.FileSystemObject");
    var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins");
    var pathSelf = WScript.ScriptFullName;
    // Put the user at ease by addressing them in the first person
    shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
    if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
        shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
    } else if (!fs.FolderExists(pathPlugins)) {
        shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
    } else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
        fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
        // Show the user where to put plugins in the future
        shell.Exec("explorer " + pathPlugins);
        shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
    }
    WScript.Quit();
@else@*/
/* Generated Code */
const config = {
	"info": {
		"name": "AvatarsEverywhere",
		"authors": [{
			"name": "A user",
			"discord_id": "264062457448759296",
			"github_username": "abUwUser",
			"twitter_username": "auwuser"
		}],
		"version": "0.0.1",
		"description": "Applys users avatar in different places",
		"github": "https://github.com/abUwUser/BDPlugins/tree/main/plugins/AvatarsEverywhere",
		"github_raw": "https://raw.githubusercontent.com/abUwUser/BDPlugins/compiled/AvatarsEverywhere/AvatarsEverywhere.plugin.js"
	},
	"build": {
		"copy": true,
		"zlibrary": true,
		"watch": true,
		"release": {
			"source": true,
			"public": true
		}
	}
};
function buildPlugin([BasePlugin, PluginApi]) {
	const module = {
		exports: {}
	};
	(() => {
		"use strict";
		class StyleLoader {
			static styles = "";
			static element = null;
			static append(module, css) {
				this.styles += `/* ${module} */\n${css}`;
			}
			static inject(name = config.info.name) {
				if (this.element) this.element.remove();
				this.element = document.head.appendChild(Object.assign(document.createElement("style"), {
					id: name,
					textContent: this.styles
				}));
			}
			static remove() {
				if (this.element) {
					this.element.remove();
					this.element = null;
				}
			}
		}
		function ___createMemoize___(instance, name, value) {
			value = value();
			Object.defineProperty(instance, name, {
				value,
				configurable: true
			});
			return value;
		};
		const Modules = {
			get 'react-spring'() {
				return ___createMemoize___(this, 'react-spring', () => BdApi.findModuleByProps('useSpring'))
			},
			'@discord/utils': {
				get 'joinClassNames'() {
					return ___createMemoize___(this, 'joinClassNames', () => BdApi.findModule(m => typeof m?.default?.default === 'function')?.default)
				},
				get 'useForceUpdate'() {
					return ___createMemoize___(this, 'useForceUpdate', () => BdApi.findModuleByProps('useForceUpdate')?.useForceUpdate)
				},
				get 'Logger'() {
					return ___createMemoize___(this, 'Logger', () => BdApi.findModuleByProps('setLogFn')?.default)
				},
				get 'Navigation'() {
					return ___createMemoize___(this, 'Navigation', () => BdApi.findModuleByProps('replaceWith'))
				}
			},
			'@discord/components': {
				get 'Tooltip'() {
					return ___createMemoize___(this, 'Tooltip', () => BdApi.findModuleByDisplayName('Tooltip'))
				},
				get 'TooltipContainer'() {
					return ___createMemoize___(this, 'TooltipContainer', () => BdApi.findModuleByProps('TooltipContainer')?.TooltipContainer)
				},
				get 'TextInput'() {
					return ___createMemoize___(this, 'TextInput', () => BdApi.findModuleByDisplayName('TextInput'))
				},
				get 'SlideIn'() {
					return ___createMemoize___(this, 'SlideIn', () => BdApi.findModuleByDisplayName('SlideIn'))
				},
				get 'SettingsNotice'() {
					return ___createMemoize___(this, 'SettingsNotice', () => BdApi.findModuleByDisplayName('SettingsNotice'))
				},
				get 'TransitionGroup'() {
					return ___createMemoize___(this, 'TransitionGroup', () => BdApi.findModuleByDisplayName('TransitionGroup'))
				},
				get 'Button'() {
					return ___createMemoize___(this, 'Button', () => BdApi.findModuleByProps('DropdownSizes'))
				},
				get 'Flex'() {
					return ___createMemoize___(this, 'Flex', () => BdApi.findModuleByDisplayName('Flex'))
				},
				get 'Text'() {
					return ___createMemoize___(this, 'Text', () => BdApi.findModuleByDisplayName('Text'))
				},
				get 'Card'() {
					return ___createMemoize___(this, 'Card', () => BdApi.findModuleByDisplayName('Card'))
				}
			},
			'@discord/modules': {
				get 'Dispatcher'() {
					return ___createMemoize___(this, 'Dispatcher', () => BdApi.findModuleByProps('dirtyDispatch', 'subscribe'))
				},
				get 'EmojiUtils'() {
					return ___createMemoize___(this, 'EmojiUtils', () => BdApi.findModuleByProps('uploadEmoji'))
				},
				get 'PermissionUtils'() {
					return ___createMemoize___(this, 'PermissionUtils', () => BdApi.findModuleByProps('computePermissions'))
				},
				get 'DMUtils'() {
					return ___createMemoize___(this, 'DMUtils', () => BdApi.findModuleByProps('openPrivateChannel'))
				}
			},
			'@discord/stores': {
				get 'Messages'() {
					return ___createMemoize___(this, 'Messages', () => BdApi.findModuleByProps('getMessage', 'getMessages'))
				},
				get 'Channels'() {
					return ___createMemoize___(this, 'Channels', () => BdApi.findModuleByProps('getChannel'))
				},
				get 'Guilds'() {
					return ___createMemoize___(this, 'Guilds', () => BdApi.findModuleByProps('getGuild'))
				},
				get 'SelectedGuilds'() {
					return ___createMemoize___(this, 'SelectedGuilds', () => BdApi.findModuleByProps('getGuildId', 'getLastSelectedGuildId'))
				},
				get 'SelectedChannels'() {
					return ___createMemoize___(this, 'SelectedChannels', () => BdApi.findModuleByProps('getChannelId', 'getLastSelectedChannelId'))
				},
				get 'Info'() {
					return ___createMemoize___(this, 'Info', () => BdApi.findModuleByProps('getSessionId'))
				},
				get 'Status'() {
					return ___createMemoize___(this, 'Status', () => BdApi.findModuleByProps('getStatus'))
				},
				get 'Users'() {
					return ___createMemoize___(this, 'Users', () => BdApi.findModuleByProps('getUser', 'getCurrentUser'))
				},
				get 'SettingsStore'() {
					return ___createMemoize___(this, 'SettingsStore', () => BdApi.findModuleByProps('afkTimeout', 'status'))
				},
				get 'UserProfile'() {
					return ___createMemoize___(this, 'UserProfile', () => BdApi.findModuleByProps('getUserProfile'))
				},
				get 'Members'() {
					return ___createMemoize___(this, 'Members', () => BdApi.findModuleByProps('getMember'))
				},
				get 'Activities'() {
					return ___createMemoize___(this, 'Activities', () => BdApi.findModuleByProps('getActivities'))
				},
				get 'Games'() {
					return ___createMemoize___(this, 'Games', () => BdApi.findModuleByProps('getGame'))
				},
				get 'Auth'() {
					return ___createMemoize___(this, 'Auth', () => BdApi.findModuleByProps('getId', 'isGuest'))
				},
				get 'TypingUsers'() {
					return ___createMemoize___(this, 'TypingUsers', () => BdApi.findModuleByProps('isTyping'))
				}
			},
			'@discord/actions': {
				get 'ProfileActions'() {
					return ___createMemoize___(this, 'ProfileActions', () => BdApi.findModuleByProps('fetchProfile'))
				},
				get 'GuildActions'() {
					return ___createMemoize___(this, 'GuildActions', () => BdApi.findModuleByProps('requestMembersById'))
				}
			},
			get '@discord/i18n'() {
				return ___createMemoize___(this, '@discord/i18n', () => BdApi.findModuleByProps('getLocale'))
			},
			get '@discord/constants'() {
				return ___createMemoize___(this, '@discord/constants', () => BdApi.findModuleByProps('API_HOST'))
			},
			get '@discord/contextmenu'() {
				return ___createMemoize___(this, '@discord/contextmenu', () => {
					const ctx = Object.assign({}, BdApi.findModuleByProps('openContextMenu'), BdApi.findModuleByProps('MenuItem'));
					ctx.Menu = ctx.default;
					return ctx;
				})
			},
			get '@discord/forms'() {
				return ___createMemoize___(this, '@discord/forms', () => BdApi.findModuleByProps('FormItem'))
			},
			get '@discord/scrollbars'() {
				return ___createMemoize___(this, '@discord/scrollbars', () => BdApi.findModuleByProps('ScrollerAuto'))
			},
			get '@discord/native'() {
				return ___createMemoize___(this, '@discord/native', () => BdApi.findModuleByProps('requireModule'))
			},
			get '@discord/flux'() {
				return ___createMemoize___(this, '@discord/flux', () => Object.assign({}, BdApi.findModuleByProps('useStateFromStores').default, BdApi.findModuleByProps('useStateFromStores')))
			},
			get '@discord/modal'() {
				return ___createMemoize___(this, '@discord/modal', () => Object.assign({}, BdApi.findModuleByProps('ModalRoot'), BdApi.findModuleByProps('openModal')))
			},
			get '@discord/connections'() {
				return ___createMemoize___(this, '@discord/connections', () => BdApi.findModuleByProps('get', 'isSupported', 'map'))
			},
			get '@discord/sanitize'() {
				return ___createMemoize___(this, '@discord/sanitize', () => BdApi.findModuleByProps('stringify', 'parse', 'encode'))
			},
			get '@discord/icons'() {
				return ___createMemoize___(this, '@discord/icons', () => BdApi.findAllModules(m => m.displayName && ~m.toString().indexOf('currentColor')).reduce((icons, icon) => (icons[icon.displayName] = icon, icons), {}))
			},
			'@discord/classes': {
				get 'Timestamp'() {
					return ___createMemoize___(this, 'Timestamp', () => BdApi.findModuleByPrototypes('toDate', 'month'))
				},
				get 'Message'() {
					return ___createMemoize___(this, 'Message', () => BdApi.findModuleByPrototypes('getReaction', 'isSystemDM'))
				},
				get 'User'() {
					return ___createMemoize___(this, 'User', () => BdApi.findModuleByPrototypes('tag'))
				},
				get 'Channel'() {
					return ___createMemoize___(this, 'Channel', () => BdApi.findModuleByPrototypes('isOwner', 'isCategory'))
				}
			}
		};
		var __webpack_modules__ = {
			911: (module, __webpack_exports__, __webpack_require__) => {
				__webpack_require__.d(__webpack_exports__, {
					Z: () => __WEBPACK_DEFAULT_EXPORT__
				});
				var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(645);
				var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
				var ___CSS_LOADER_EXPORT___ = _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()((function(i) {
					return i[1];
				}));
				___CSS_LOADER_EXPORT___.push([module.id, ".AvatarsEverywhere-category-category.AvatarsEverywhere-category-compact{position:inherit}.AvatarsEverywhere-category-category.AvatarsEverywhere-category-compact .AvatarsEverywhere-category-header{display:flex;align-items:center;justify-content:space-between;padding:2px;padding-left:10px;text-transform:uppercase;font-weight:600;font-size:.9rem}.AvatarsEverywhere-category-category.AvatarsEverywhere-category-compact .AvatarsEverywhere-category-header .AvatarsEverywhere-category-caret{float:right;display:inline-flex;color:var(--interactive-normal)}.AvatarsEverywhere-category-category.AvatarsEverywhere-category-compact .AvatarsEverywhere-category-header .AvatarsEverywhere-category-stroke{background-color:var(--background-modifier-accent);height:2px;flex:1;margin:0 5px 0 10px}.AvatarsEverywhere-category-category.AvatarsEverywhere-category-compact .AvatarsEverywhere-category-header .AvatarsEverywhere-category-label{color:var(--interactive-normal)}.AvatarsEverywhere-category-category.AvatarsEverywhere-category-compact .AvatarsEverywhere-category-content{padding-left:20px;width:calc(100% - 40px)}.AvatarsEverywhere-category-category.AvatarsEverywhere-category-default{background:rgba(32,34,37,.3);border:1px solid #202225;margin:5px;cursor:pointer;border-radius:3px;--color: var(--interactive-normal)}.AvatarsEverywhere-category-category.AvatarsEverywhere-category-default:hover{--color: var(--interactive-hover)}.AvatarsEverywhere-category-category.AvatarsEverywhere-category-default .AvatarsEverywhere-category-header{padding-right:5px;padding:10px 15px;padding-bottom:0;display:flex;align-items:center;justify-content:space-between}.AvatarsEverywhere-category-category.AvatarsEverywhere-category-default .AvatarsEverywhere-category-header .AvatarsEverywhere-category-stroke{display:none}.AvatarsEverywhere-category-category.AvatarsEverywhere-category-default .AvatarsEverywhere-category-header .AvatarsEverywhere-category-divider{position:relative}.AvatarsEverywhere-category-category.AvatarsEverywhere-category-default .AvatarsEverywhere-category-header .AvatarsEverywhere-category-label{font-size:1rem;font-weight:600;color:#fff;text-transform:uppercase}.AvatarsEverywhere-category-category.AvatarsEverywhere-category-default .AvatarsEverywhere-category-header .AvatarsEverywhere-category-caret{color:var(--color);transition:color .3s}.AvatarsEverywhere-category-category.AvatarsEverywhere-category-default.AvatarsEverywhere-category-opened .AvatarsEverywhere-category-content{padding:8px}.AvatarsEverywhere-category-category.AvatarsEverywhere-category-default.AvatarsEverywhere-category-opened .AvatarsEverywhere-category-header{background:rgba(32,34,37,.6)}", ""]);
				___CSS_LOADER_EXPORT___.locals = {
					category: "AvatarsEverywhere-category-category",
					compact: "AvatarsEverywhere-category-compact",
					header: "AvatarsEverywhere-category-header",
					caret: "AvatarsEverywhere-category-caret",
					stroke: "AvatarsEverywhere-category-stroke",
					label: "AvatarsEverywhere-category-label",
					content: "AvatarsEverywhere-category-content",
					default: "AvatarsEverywhere-category-default",
					divider: "AvatarsEverywhere-category-divider",
					opened: "AvatarsEverywhere-category-opened"
				};
				StyleLoader.append(module.id, ___CSS_LOADER_EXPORT___.toString());
				const __WEBPACK_DEFAULT_EXPORT__ = Object.assign(___CSS_LOADER_EXPORT___, ___CSS_LOADER_EXPORT___.locals);
			},
			46: (module, __webpack_exports__, __webpack_require__) => {
				__webpack_require__.d(__webpack_exports__, {
					Z: () => __WEBPACK_DEFAULT_EXPORT__
				});
				var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(645);
				var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
				var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()((function(i) {
					return i[1];
				}));
				___CSS_LOADER_EXPORT___.push([module.id, ".AvatarsEverywhere-style-avatar-util-align-wrapper{display:inline-flex;flex-direction:row;align-items:center;vertical-align:bottom}.AvatarsEverywhere-style-avatar-util-align-wrapper-icon{margin-right:4px}", ""]);
				___CSS_LOADER_EXPORT___.locals = {
					"avatar-util-align-wrapper": "AvatarsEverywhere-style-avatar-util-align-wrapper",
					"avatar-util-align-wrapper-icon": "AvatarsEverywhere-style-avatar-util-align-wrapper-icon"
				};
				StyleLoader.append(module.id, ___CSS_LOADER_EXPORT___.toString());
				const __WEBPACK_DEFAULT_EXPORT__ = Object.assign(___CSS_LOADER_EXPORT___, ___CSS_LOADER_EXPORT___.locals);
			},
			617: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
				__webpack_require__.r(__webpack_exports__);
				__webpack_require__.d(__webpack_exports__, {
					default: () => AvatarsEverywhere
				});
				const external_PluginApi_namespaceObject = PluginApi;
				const external_BasePlugin_namespaceObject = BasePlugin;
				var external_BasePlugin_default = __webpack_require__.n(external_BasePlugin_namespaceObject);
				const stores_namespaceObject = Modules["@discord/stores"];
				var style = __webpack_require__(46);
				const external_StyleLoader_namespaceObject = StyleLoader;
				var external_StyleLoader_default = __webpack_require__.n(external_StyleLoader_namespaceObject);
				var external_BdApi_React_ = __webpack_require__(113);
				var external_BdApi_React_default = __webpack_require__.n(external_BdApi_React_);
				const icons_namespaceObject = Modules["@discord/icons"];
				const flux_namespaceObject = Modules["@discord/flux"];
				var React = __webpack_require__(113);
				function _extends() {
					_extends = Object.assign || function(target) {
						for (var i = 1; i < arguments.length; i++) {
							var source = arguments[i];
							for (var key in source)
								if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
						}
						return target;
					};
					return _extends.apply(this, arguments);
				}
				const createUpdateWrapper = (Component, valueProp = "value", changeProp = "onChange", valueIndex = 0) => props => {
					const [value, setValue] = React.useState(props[valueProp]);
					return React.createElement(Component, _extends({}, props, {
						[valueProp]: value,
						[changeProp]: (...args) => {
							const value = args[valueIndex];
							if ("function" === typeof props[changeProp]) props[changeProp](value);
							setValue(value);
						}
					}));
				};
				const hooks_createUpdateWrapper = createUpdateWrapper;
				const utils_namespaceObject = Modules["@discord/utils"];
				var category = __webpack_require__(911);
				function Category({
					label,
					children,
					className,
					look = Category.Looks.DEFAULT
				}) {
					const [opened, toggle] = (0, external_BdApi_React_.useState)(false);
					const isCompact = look === category.Z.compact;
					return external_BdApi_React_default().createElement("div", {
						className: (0, utils_namespaceObject.joinClassNames)(className, look, category.Z.category, {
							[category.Z.opened]: opened
						})
					}, external_BdApi_React_default().createElement("div", {
						className: category.Z.header,
						onClick: () => toggle(!opened)
					}, external_BdApi_React_default().createElement("div", {
						className: category.Z.label
					}, label), isCompact ? external_BdApi_React_default().createElement("div", {
						className: category.Z.stroke
					}) : null, external_BdApi_React_default().createElement(icons_namespaceObject.Caret, {
						direction: opened ? icons_namespaceObject.Caret.Directions.DOWN : isCompact ? icons_namespaceObject.Caret.Directions.LEFT : icons_namespaceObject.Caret.Directions.RIGHT,
						className: category.Z.caret
					})), !isCompact ? external_BdApi_React_default().createElement("div", {
						className: category.Z.divider
					}) : null, external_BdApi_React_default().createElement("div", {
						className: category.Z.content
					}, opened ? children : null));
				}
				Category.Looks = {
					COMPACT: category.Z.compact,
					DEFAULT: category.Z["default"]
				};
				const modules_namespaceObject = Modules["@discord/modules"];
				function _defineProperty(obj, key, value) {
					if (key in obj) Object.defineProperty(obj, key, {
						value,
						enumerable: true,
						configurable: true,
						writable: true
					});
					else obj[key] = value;
					return obj;
				}
				class SettingsManager extends flux_namespaceObject.Store {
					constructor(pluginName, defaultSettings = {}) {
						super(modules_namespaceObject.Dispatcher, {});
						_defineProperty(this, "settings", void 0);
						_defineProperty(this, "pluginName", void 0);
						_defineProperty(this, "get", ((key, defaultValue) => this.settings[key] ?? defaultValue));
						_defineProperty(this, "set", ((key, value) => {
							this.settings[key] = value;
							external_PluginApi_namespaceObject.PluginUtilities.saveSettings(this.pluginName, this.settings);
							this.emitChange();
							return value;
						}));
						this.pluginName = pluginName;
						this.settings = external_PluginApi_namespaceObject.PluginUtilities.loadSettings(pluginName, defaultSettings);
					}
				}
				const package_namespaceObject = JSON.parse('{"u":{"u2":"AvatarsEverywhere"}}');
				const settings = new SettingsManager(package_namespaceObject.u.u2);
				const settingsManager = settings;
				const SwitchItem = hooks_createUpdateWrapper(external_PluginApi_namespaceObject.WebpackModules.getByDisplayName("SwitchItem"));
				const Settings = external_BdApi_React_default().memo((() => {
					const mentionsDisabled = (0, flux_namespaceObject.useStateFromStores)([settingsManager], (() => !settingsManager.get("mentions", true)));
					const compactMessagesDisabled = (0, flux_namespaceObject.useStateFromStores)([settingsManager], (() => !settingsManager.get("compact-message", false)));
					return external_BdApi_React_default().createElement(external_BdApi_React_default().Fragment, null, external_BdApi_React_default().createElement(Category, {
						look: Category.Looks.COMPACT,
						label: external_BdApi_React_default().createElement(LabelWrapper, {
							icon: icons_namespaceObject.ChatBubble,
							name: "Mentions"
						})
					}, external_BdApi_React_default().createElement(SwitchItem, {
						value: settingsManager.get("mentions", true),
						onChange: value => settingsManager.set("mentions", value)
					}, "Enable"), external_BdApi_React_default().createElement(SwitchItem, {
						value: settingsManager.get("mentions-no-at", false),
						onChange: value => settingsManager.set("mentions-no-at", value),
						disabled: mentionsDisabled
					}, "Remove the @ symbol")), external_BdApi_React_default().createElement(Category, {
						look: Category.Looks.COMPACT,
						label: external_BdApi_React_default().createElement(LabelWrapper, {
							icon: icons_namespaceObject.OverflowMenuHorizontal,
							name: "Typing users"
						})
					}, external_BdApi_React_default().createElement(SwitchItem, {
						value: settingsManager.get("typing-users", true),
						onChange: value => settingsManager.set("typing-users", value)
					}, "Enable")), external_BdApi_React_default().createElement(Category, {
						look: Category.Looks.COMPACT,
						label: external_BdApi_React_default().createElement(LabelWrapper, {
							icon: icons_namespaceObject.Robot,
							name: "System Messages"
						})
					}, external_BdApi_React_default().createElement(SwitchItem, {
						value: settingsManager.get("system-messages-join", true),
						onChange: value => settingsManager.set("system-messages-join", value)
					}, "Join messages"), external_BdApi_React_default().createElement(SwitchItem, {
						value: settingsManager.get("system-messages-boost", true),
						onChange: value => settingsManager.set("system-messages-boost", value)
					}, "Boost messages"), external_BdApi_React_default().createElement(SwitchItem, {
						value: settingsManager.get("system-messages-thread", true),
						onChange: value => settingsManager.set("system-messages-thread", value)
					}, "Thread messages")), external_BdApi_React_default().createElement(Category, {
						look: Category.Looks.COMPACT,
						label: external_BdApi_React_default().createElement(LabelWrapper, {
							icon: icons_namespaceObject.DoubleStarIcon,
							name: "Compact mode (beta)"
						})
					}, external_BdApi_React_default().createElement(SwitchItem, {
						value: settingsManager.get("compact-message", false),
						onChange: value => settingsManager.set("compact-message", value)
					}, "User icon on messages"), external_BdApi_React_default().createElement(SwitchItem, {
						value: settingsManager.get("compact-message-reply", false),
						onChange: value => settingsManager.set("compact-message-reply", value),
						disabled: compactMessagesDisabled
					}, "Replies")));
				}));
				const LabelWrapper = ({
					icon: Component,
					name
				}) => external_BdApi_React_default().createElement("span", {
					style: {
						display: "flex",
						alignItems: "center"
					}
				}, external_BdApi_React_default().createElement(Component, {
					width: 20,
					height: 20,
					style: {
						marginRight: "4px"
					}
				}), " ", name);
				var AvatarsEverywhere_React = __webpack_require__(113);
				const {
					AvatarDefaults,
					RelationshipStore
				} = external_PluginApi_namespaceObject.DiscordModules;
				const {
					default: Avatar
				} = external_PluginApi_namespaceObject.WebpackModules.getByProps("AnimatedAvatar");
				class AvatarsEverywhere extends(external_BasePlugin_default()) {
					onStart() {
						external_StyleLoader_default().inject();
						this.patchUserMention();
						this.patchTypingBar();
						this.patchCompactMessages();
						this.patchSystemMessages();
					}
					patchUserMention() {
						external_PluginApi_namespaceObject.Patcher.after(external_PluginApi_namespaceObject.WebpackModules.getModule((m => "UserMention" === m?.default?.displayName)), "default", ((_this, [props], wrapperRes) => {
							if (!settingsManager.get("mentions", true)) return;
							const _oldFunc = wrapperRes.props.children;
							wrapperRes.props.children = function() {
								let res = _oldFunc.apply(this, arguments);
								let text = res.props.children;
								if (settingsManager.get("mentions-no-at", false)) text = external_PluginApi_namespaceObject.Utilities.findInTree(text, (e => "@" === e?.charAt?.(0))).slice(1);
								const user = stores_namespaceObject.Users.getUser(props.userId);
								res.props.children = [AvatarsEverywhere_React.createElement(Avatar, {
									src: AvatarDefaults.getUserAvatarURL(user),
									className: style.Z["avatar-util-align-wrapper-icon"],
									size: Avatar.Sizes.SIZE_16
								}), text];
								res.props.className += " " + style.Z["avatar-util-align-wrapper"];
								return res;
							};
						}));
					}
					async patchTypingBar() {
						const filterTypingUsers = typingUsers => {
							if (!typingUsers) return [];
							return Object.keys(typingUsers).filter((e => e != stores_namespaceObject.Users.getCurrentUser().id)).filter((e => !RelationshipStore.isBlocked(e))).map((e => stores_namespaceObject.Users.getUser(e))).filter((function(e) {
								return null != e;
							}));
						};
						const TypingUsers = await external_PluginApi_namespaceObject.ReactComponents.getComponentByName("TypingUsers");
						if (!TypingUsers?.component?.prototype) return;
						external_PluginApi_namespaceObject.Patcher.after(TypingUsers.component.prototype, "render", ((_this, [props], res) => {
							if (!settingsManager.get("typing-users", true)) return;
							const typingUsers = filterTypingUsers(Object.assign({}, _this.props.typingUsers));
							for (let m = 0; m < typingUsers.length; m++) {
								const user = stores_namespaceObject.Users.getUser(typingUsers[m].id);
								if (!user) continue;
								let userChildren = res.props.children[1].props.children[2 * m];
								userChildren.props.children.unshift(AvatarsEverywhere_React.createElement(Avatar, {
									src: AvatarDefaults.getUserAvatarURL(user),
									className: style.Z["avatar-util-align-wrapper-icon"],
									size: Avatar.Sizes.SIZE_16
								}));
								userChildren.props.className += " " + style.Z["avatar-util-align-wrapper"];
							}
						}));
						TypingUsers.forceUpdateAll();
					}
					patchCompactMessages() {
						external_PluginApi_namespaceObject.Patcher.after(external_PluginApi_namespaceObject.WebpackModules.find((e => e.default?.toString().indexOf("getGuildMemberAvatarURLSimple") > -1)), "default", ((_this, [props], res) => {
							if (!settingsManager.get("compact-message", false) || !stores_namespaceObject.SettingsStore.messageDisplayCompact) return;
							if (!props.compact) return;
							if (!(settingsManager.get("compact-message-reply", false) && props.hasOwnProperty("withMentionPrefix"))) return;
							let header = external_PluginApi_namespaceObject.Utilities.findInReactTree(res, (e => e?.renderPopout));
							console.log(header);
							const ogFunc = header?.children;
							if (!ogFunc) return;
							header.children = (...args) => {
								let ret = ogFunc(...args);
								let children = ret.props?.children;
								ret.props.className += " " + style.Z["avatar-util-align-wrapper"];
								if (AvatarsEverywhere_React.isValidElement(children.props?.children?.[0])) return ret;
								const url = AvatarDefaults.getUserAvatarURL(props.message.author);
								children.props.children.unshift(AvatarsEverywhere_React.createElement(Avatar, {
									src: url,
									className: style.Z["avatar-util-align-wrapper-icon"],
									size: Avatar.Sizes.SIZE_16
								}));
								return ret;
							};
						}));
					}
					patchSystemMessages() {
						external_PluginApi_namespaceObject.Patcher.after(external_PluginApi_namespaceObject.WebpackModules.find((m => "UserJoin" === m.default?.displayName)), "default", ((_this, [props], res) => {
							if (!settingsManager.get("system-messages-join", true)) return;
							let userName = external_PluginApi_namespaceObject.Utilities.findInReactTree(res, (e => e?.renderPopout));
							const ogFunc = userName?.children;
							if (!ogFunc) return;
							userName.children = (...args) => {
								let ret = ogFunc(...args);
								ret.props.className += " " + style.Z["avatar-util-align-wrapper"];
								if (AvatarsEverywhere_React.isValidElement(ret.props?.children?.[0])) return ret;
								const url = AvatarDefaults.getUserAvatarURL(props.message.author);
								ret.props.children.unshift(AvatarsEverywhere_React.createElement(Avatar, {
									src: url,
									className: style.Z["avatar-util-align-wrapper-icon"],
									size: Avatar.Sizes.SIZE_16
								}));
								return ret;
							};
						}));
						external_PluginApi_namespaceObject.Patcher.after(external_PluginApi_namespaceObject.WebpackModules.find((m => "UserPremiumGuildSubscription" === m.default?.displayName)).default.prototype, "render", ((_this, [props], res) => {
							if (!settingsManager.get("system-messages-boost", true)) return;
							let userName = external_PluginApi_namespaceObject.Utilities.findInReactTree(res, (e => e?.props?.renderPopout));
							const ogFunc = userName?.props?.children;
							if (!ogFunc) return;
							userName.props.children = (...args) => {
								let ret = ogFunc(...args);
								ret.props.className += " " + style.Z["avatar-util-align-wrapper"];
								if (AvatarsEverywhere_React.isValidElement(ret.props?.children?.[0])) return ret;
								const url = AvatarDefaults.getUserAvatarURL(_this.props.message.author);
								ret.props.children.unshift(AvatarsEverywhere_React.createElement(Avatar, {
									src: url,
									className: style.Z["avatar-util-align-wrapper-icon"],
									size: Avatar.Sizes.SIZE_16
								}));
								return ret;
							};
						}));
						external_PluginApi_namespaceObject.Patcher.after(external_PluginApi_namespaceObject.WebpackModules.find((m => "ThreadCreated" === m.default?.displayName)), "default", ((_this, [props], res) => {
							if (!settingsManager.get("system-messages-thread", true)) return;
							const url = AvatarDefaults.getUserAvatarURL(props.message.author);
							res.props.children.unshift(AvatarsEverywhere_React.createElement(Avatar, {
								src: url,
								className: style.Z["avatar-util-align-wrapper-icon"],
								size: Avatar.Sizes.SIZE_16
							}));
						}));
					}
					getSettingsPanel() {
						return AvatarsEverywhere_React.createElement(Settings, null);
					}
					onStop() {
						external_PluginApi_namespaceObject.Patcher.unpatchAll();
						external_StyleLoader_default().remove();
					}
				}
			},
			645: module => {
				module.exports = function(cssWithMappingToString) {
					var list = [];
					list.toString = function toString() {
						return this.map((function(item) {
							var content = cssWithMappingToString(item);
							if (item[2]) return "@media ".concat(item[2], " {").concat(content, "}");
							return content;
						})).join("");
					};
					list.i = function(modules, mediaQuery, dedupe) {
						if ("string" === typeof modules) modules = [
							[null, modules, ""]
						];
						var alreadyImportedModules = {};
						if (dedupe)
							for (var i = 0; i < this.length; i++) {
								var id = this[i][0];
								if (null != id) alreadyImportedModules[id] = true;
							}
						for (var _i = 0; _i < modules.length; _i++) {
							var item = [].concat(modules[_i]);
							if (dedupe && alreadyImportedModules[item[0]]) continue;
							if (mediaQuery)
								if (!item[2]) item[2] = mediaQuery;
								else item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
							list.push(item);
						}
					};
					return list;
				};
			},
			113: module => {
				module.exports = BdApi.React;
			}
		};
		var __webpack_module_cache__ = {};
		function __webpack_require__(moduleId) {
			var cachedModule = __webpack_module_cache__[moduleId];
			if (void 0 !== cachedModule) return cachedModule.exports;
			var module = __webpack_module_cache__[moduleId] = {
				id: moduleId,
				exports: {}
			};
			__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
			return module.exports;
		}
		(() => {
			__webpack_require__.n = module => {
				var getter = module && module.__esModule ? () => module["default"] : () => module;
				__webpack_require__.d(getter, {
					a: getter
				});
				return getter;
			};
		})();
		(() => {
			__webpack_require__.d = (exports, definition) => {
				for (var key in definition)
					if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) Object.defineProperty(exports, key, {
						enumerable: true,
						get: definition[key]
					});
			};
		})();
		(() => {
			__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
		})();
		(() => {
			__webpack_require__.r = exports => {
				if ("undefined" !== typeof Symbol && Symbol.toStringTag) Object.defineProperty(exports, Symbol.toStringTag, {
					value: "Module"
				});
				Object.defineProperty(exports, "__esModule", {
					value: true
				});
			};
		})();
		var __webpack_exports__ = __webpack_require__(617);
		module.exports.LibraryPluginHack = __webpack_exports__;
	})();
	const PluginExports = module.exports.LibraryPluginHack;
	return PluginExports?.__esModule ? PluginExports.default : PluginExports;
}
module.exports = window.hasOwnProperty("ZeresPluginLibrary") ?
	buildPlugin(window.ZeresPluginLibrary.buildPlugin(config)) :
	class {
		getName() {
			return config.info.name;
		}
		getAuthor() {
			return config.info.authors.map(a => a.name).join(", ");
		}
		getDescription() {
			return `${config.info.description}. __**ZeresPluginLibrary was not found! This plugin will not work!**__`;
		}
		getVersion() {
			return config.info.version;
		}
		load() {
			BdApi.showConfirmationModal(
				"Library plugin is needed",
				[`The library plugin needed for ${config.info.name} is missing. Please click Download to install it.`], {
					confirmText: "Download",
					cancelText: "Cancel",
					onConfirm: () => {
						require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
							if (error) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
							await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
						});
					}
				}
			);
		}
		start() {}
		stop() {}
	};
/*@end@*/